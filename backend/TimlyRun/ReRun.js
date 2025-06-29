import Interaction from '../Models/Interactions.js'
import Interest    from '../Models/Interest.js';

const LIKE_WEIGHT = { upvote:3, comment:2, subscribe:4 };
// views counted for "frequent"
const DAYS = 7;                        // recent window
const MIN_VIEWS = 3;                   // threshold to call it "regular"

export const rebuildProfiles=async()=>{
  // 1️⃣ Likes / hobbies
  await Interaction.aggregate([
    { $match: { type:{ $in:['upvote','comment'] } } },
    { $unwind:'$topics' },
    { $group:{
        _id:{ user:'$userId', topic:'$topics' },
        score:{ $sum:{ $switch:{
          branches:[
            { case:{ $eq:['$type','upvote'] }, then:LIKE_WEIGHT.upvote },
            { case:{ $eq:['$type','comment']}, then:LIKE_WEIGHT.comment }
          ],
          default:0
        }}}
    }},
    { $group:{
        _id:'$_id.user',
        likes:{ $push:{ k:'$_id.topic', v:'$score' } }
    }},
    { $addFields:{ likes:{ $arrayToObject:'$likes' }}},
    { $merge:{ into:'interests', on:'_id', whenMatched:'merge', whenNotMatched:'insert' }}
  ]);

  // 2️⃣ Frequent visits (last 7 days)
  const since = new Date(Date.now() - DAYS*24*60*60*1000);
  await Interaction.aggregate([
    { $match:{ type:'view', ts:{ $gte:since } } },
    { $unwind:'$topics' },
    { $group:{
        _id:{ user:'$userId', topic:'$topics' },
        views:{ $sum:1 }
    }},
    { $match:{ views:{ $gte:MIN_VIEWS } } },
    { $group:{
        _id:'$_id.user',
        frequent:{ $push:{ k:'$_id.topic', v:'$views' } }
    }},
    { $addFields:{ frequent:{ $arrayToObject:'$frequent' }}},
    { $merge:{ into:'interests', on:'_id', whenMatched:'merge', whenNotMatched:'insert' }}
  ]);

  // 3️⃣ Unexplored but relevant topics
    await Interest.aggregate([
    /* 3.1  turn objects -> array[{k,v}] and collect known topics */
    {
      $project: {
        likeKeys: {
          $map: {                          // ← instead of $keys: "$likes"
            input: { $objectToArray: '$likes' },
            as: 'pair',
            in: '$$pair.k'
          }
        },
        freqKeys: {
          $map: {                          // ← instead of $keys: "$frequent"
            input: { $objectToArray: '$frequent' },
            as: 'pair',
            in: '$$pair.k'
          }
        }
      }
    },
    {
      $addFields: {
        allKnown: { $setUnion: ['$likeKeys', '$freqKeys'] }
      }
    },

    /* 3.2  find neighbours that share ≥1 topic */
    {
      $lookup: {
        from: 'interests',
        let: { known: '$allKnown', me: '$_id' },
        pipeline: [
          {
            $project: {
              _id: 1,
              likeKeys: {
                $map: {
                  input: { $objectToArray: '$likes' },
                  as: 'p',
                  in: '$$p.k'
                }
              },
              freqKeys: {
                $map: {
                  input: { $objectToArray: '$frequent' },
                  as: 'p',
                  in: '$$p.k'
                }
              }
            }
          },
          {
            $addFields: {
              theirKeys: { $setUnion: ['$likeKeys', '$freqKeys'] }
            }
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$_id', '$$me'] },
                  {
                    $gt: [
                      { $size: { $setIntersection: ['$$known', '$theirKeys'] } },
                      0
                    ]
                  }
                ]
              }
            }
          }
        ],
        as: 'neighbours'
      }
    },
    { $unwind: '$neighbours' },

    /* 3.3  build suggestions */
    {
      $project: {
        allKnown: 1,
        neighbourTopics: '$neighbours.theirKeys'
      }
    },
    {
      $project: {
        suggestions: { $setDifference: ['$neighbourTopics', '$allKnown'] }
      }
    },
    {
      $merge: {
        into: 'interests',
        on: '_id',
        whenMatched: 'merge',
        whenNotMatched: 'discard'
      }
    }
  ]);
}
