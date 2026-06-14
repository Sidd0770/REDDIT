// Seed script – creates users, communities, profiles, and 200 posts
// Run:  node seed.js
// Requires: MongoDB running at mongodb://localhost:27017/Reddit

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Connect ──────────────────────────────────────────────
await mongoose.connect('mongodb://localhost:27017/Reddit', { family: 4 });
console.log('✅ Connected to MongoDB');

// ─── Schemas (inline so the script is self-contained) ─────
const UserSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  token:      { type: String },
  isVerified: { type: Boolean, default: true },
  googleId:   { type: String, unique: true, sparse: true },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const subredditSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image:       { type: String },
  members:     { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  Posts:       { type: [mongoose.Schema.Types.ObjectId], ref: 'Post', default: [] },
  createdBy:   { type: String, ref: 'User', required: true },
  Moderators:  { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
}, { timestamps: true });
const Subreddit = mongoose.models.Subreddit || mongoose.model('Subreddit', subredditSchema);

const PostSchema = new mongoose.Schema({
  author:       { type: String, required: true },
  subreddit:    { type: String, required: true },
  title:        { type: String },
  desc:         { type: String, required: true },
  image:        { type: String },
  imagePublicid:{ type: String },
  link:         { type: String },
  votes:        { type: Number, default: 0 },
  rootID:       { type: mongoose.Schema.Types.ObjectId },
  parentID:     { type: mongoose.Schema.Types.ObjectId },
  view_count:   { type: Number, default: 0 },
  viewedBy:     { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
  lastViewedAt: { type: Date, default: null, index: true },
  topics:       { type: [String] },
}, { timestamps: true });
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

const profileSchema = new mongoose.Schema({
  userID:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username:        { type: String, ref: 'User' },
  subJoined:       { type: [String], ref: 'Subreddit', default: [] },
  subCreated:      { type: [mongoose.Schema.Types.ObjectId], ref: 'Subreddit', default: [] },
  postsCreated:    { type: [mongoose.Schema.Types.ObjectId], ref: 'Post', default: [] },
  commentsCreated: { type: [mongoose.Schema.Types.ObjectId], ref: 'Post', default: [] },
  votes:           { type: [mongoose.Schema.Types.ObjectId], ref: 'Post', default: [] },
  recentPosts:     { type: [mongoose.Schema.Types.ObjectId], ref: 'Post', default: [] },
  PostKarma:       { type: Number, default: 0 },
  CommentKarma:    { type: Number, default: 0 },
  follower:        { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
});
const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

// ─── Drop the unique index on Post.subreddit (it's a bug) ─
try {
  await Post.collection.dropIndex('subreddit_1');
  console.log('🗑  Dropped buggy unique index on Post.subreddit');
} catch (_) { /* index may not exist */ }

// ─── Seed Users ───────────────────────────────────────────
const seedUsers = [
  { username: 'TechGuru42',      email: 'techguru42@content.app' },
  { username: 'SpaceNerd',       email: 'spacenerd@content.app' },
  { username: 'GamerPro99',      email: 'gamerpro99@content.app' },
  { username: 'FitnessFanatic',  email: 'fitfanatic@content.app' },
  { username: 'BookWorm_Jane',   email: 'bookworm@content.app' },
  { username: 'CinemaLover',     email: 'cinemalover@content.app' },
  { username: 'CryptoKing',      email: 'cryptoking@content.app' },
  { username: 'NatureLens',      email: 'naturelens@content.app' },
  { username: 'CodeMonkey_Dev',  email: 'codemonkey@content.app' },
  { username: 'FoodieExplorer',  email: 'foodie@content.app' },
  { username: 'HistoryBuff101',  email: 'historybuff@content.app' },
  { username: 'MusicMaven',      email: 'musicmaven@content.app' },
  { username: 'TravelJunkie',    email: 'traveljunkie@content.app' },
  { username: 'ScienceDaily',    email: 'sciencedaily@content.app' },
  { username: 'PixelArtist',     email: 'pixelartist@content.app' },
];

const hashedPassword = await bcrypt.hash('Password123!', 10);
const createdUsers = [];

for (const u of seedUsers) {
  const existing = await User.findOne({ username: u.username });
  if (existing) {
    createdUsers.push(existing);
  } else {
    const newUser = await User.create({
      username: u.username,
      email: u.email,
      password: hashedPassword,
      isVerified: true,
    });
    createdUsers.push(newUser);
  }
}
console.log(`👤 ${createdUsers.length} users ready`);

// ─── Seed Communities ─────────────────────────────────────
const communities = [
  { name: 'Technology',     description: 'Discuss the latest in tech, gadgets, AI, and software engineering.', creator: 'TechGuru42' },
  { name: 'Space',          description: 'Everything about space exploration, astronomy, and the cosmos.', creator: 'SpaceNerd' },
  { name: 'Gaming',         description: 'News, reviews, memes, and discussions for all gamers.', creator: 'GamerPro99' },
  { name: 'Fitness',        description: 'Workouts, nutrition tips, and motivation to stay healthy.', creator: 'FitnessFanatic' },
  { name: 'Books',          description: 'Book recommendations, reviews, and literary discussions.', creator: 'BookWorm_Jane' },
  { name: 'Movies',         description: 'Discuss films, share reviews, and debate the best cinema.', creator: 'CinemaLover' },
  { name: 'Cryptocurrency', description: 'Crypto news, market analysis, and blockchain technology.', creator: 'CryptoKing' },
  { name: 'Nature',         description: 'Beautiful nature photography and environmental discussions.', creator: 'NatureLens' },
  { name: 'Programming',    description: 'Code, algorithms, career advice, and developer culture.', creator: 'CodeMonkey_Dev' },
  { name: 'Food',           description: 'Recipes, restaurant reviews, and culinary adventures.', creator: 'FoodieExplorer' },
  { name: 'History',        description: 'Fascinating stories and discussions about world history.', creator: 'HistoryBuff101' },
  { name: 'Music',          description: 'Share tracks, discuss artists, and explore all genres.', creator: 'MusicMaven' },
  { name: 'Travel',         description: 'Travel tips, destination guides, and adventure stories.', creator: 'TravelJunkie' },
  { name: 'Science',        description: 'Scientific discoveries, research papers, and curiosity-driven discussion.', creator: 'ScienceDaily' },
  { name: 'Art',            description: 'Digital art, traditional art, creative process, and inspiration.', creator: 'PixelArtist' },
];

const createdCommunities = [];
for (const c of communities) {
  const existing = await Subreddit.findOne({ name: c.name });
  if (existing) {
    createdCommunities.push(existing);
  } else {
    const creatorUser = createdUsers.find(u => u.username === c.creator);
    const newSub = await Subreddit.create({
      name: c.name,
      description: c.description,
      createdBy: c.creator,
      members: createdUsers.map(u => u._id),          // all users are members
      Moderators: creatorUser ? [creatorUser._id] : [],
    });
    createdCommunities.push(newSub);
  }
}
console.log(`🏘  ${createdCommunities.length} communities ready`);

// ─── Seed Profiles ────────────────────────────────────────
for (const u of createdUsers) {
  const exists = await Profile.findOne({ userID: u._id });
  if (!exists) {
    await Profile.create({
      userID: u._id,
      username: u.username,
      subJoined: communities.map(c => c.name),
    });
  }
}
console.log('📋 Profiles ensured');

// ─── Post Data ────────────────────────────────────────────
const postData = [
  // ── Technology (14 posts) ───────────────────────────────
  { sub: 'Technology', title: 'GPT-5 just dropped and its coding ability is insane', desc: 'OpenAI released GPT-5 today and early benchmarks show it solving competitive programming problems that GPT-4 struggled with. The reasoning chain is significantly more coherent. Anyone else tested it?', topics: ['technology', 'artificial intelligence', 'gpt'] },
  { sub: 'Technology', title: 'Apple Vision Pro 2 announced — halved the price', desc: 'Apple just announced the Vision Pro 2 at WWDC. It now starts at $1,749 and weighs 30% less. The new R2 chip handles spatial computing natively. This might finally be the version that goes mainstream.', topics: ['technology', 'apple', 'virtual reality'] },
  { sub: 'Technology', title: 'Why I switched from VS Code to Neovim (and never looked back)', desc: 'After 5 years of VS Code, I made the switch to Neovim with LazyVim. The speed difference is night and day. My workflow is now entirely keyboard-driven and I save roughly 2 hours per day. Here is my config for anyone interested.', topics: ['technology', 'programming', 'neovim'] },
  { sub: 'Technology', title: 'The EU just passed a landmark Right to Repair law', desc: 'Starting next year, all electronics sold in the EU must be repairable for at least 10 years. Manufacturers must provide spare parts and repair manuals. This is huge for reducing e-waste.', topics: ['technology', 'eu', 'right to repair'] },
  { sub: 'Technology', title: 'Linux desktop market share hits 5% for the first time', desc: 'According to StatCounter, Linux desktop usage has crossed the 5% mark globally for the first time ever. The Steam Deck and better driver support seem to be driving adoption. Are we finally in the year of Linux desktop?', topics: ['technology', 'linux', 'operating systems'] },
  { sub: 'Technology', title: 'Tesla Optimus robot now works autonomously in factories', desc: 'Tesla shared footage of Optimus performing complex assembly tasks without human intervention. It can navigate the factory floor, pick up parts, and perform quality checks. The robot revolution is real.', topics: ['technology', 'robotics', 'tesla'] },
  { sub: 'Technology', title: 'My home server setup: 128TB NAS for under $500', desc: 'I built a home NAS using refurbished enterprise drives and an old Dell Optiplex. Running TrueNAS Scale with ZFS. Total cost was $487. Here is the full parts list and step-by-step guide.', topics: ['technology', 'homelab', 'nas'] },
  { sub: 'Technology', title: 'Chrome is getting built-in AI summarization for articles', desc: 'Google announced that Chrome will now offer AI-powered article summaries in the side panel. You click a button and get a 3-sentence summary of any article. No extension needed. Rolling out next month.', topics: ['technology', 'chrome', 'ai'] },
  { sub: 'Technology', title: 'Firefox 130 brings massive performance improvements', desc: 'Mozilla released Firefox 130 with a completely rewritten rendering engine. Benchmarks show it is now competitive with Chrome on most tests. Memory usage has dropped by 40%. Worth trying again.', topics: ['technology', 'firefox', 'browsers'] },
  { sub: 'Technology', title: 'Qualcomm Snapdragon X Elite benchmarks are incredible', desc: 'Independent benchmarks of the Snapdragon X Elite show it outperforming the M3 in multi-core tasks while using 20% less power. ARM-based Windows laptops might finally be competitive.', topics: ['technology', 'qualcomm', 'processors'] },
  { sub: 'Technology', title: 'I automated my entire house with Home Assistant and Zigbee', desc: 'After months of work, every light, lock, thermostat, and sensor in my house runs through Home Assistant on a Raspberry Pi 5. Total cost was about $300. Here is my dashboard and automation runbook.', topics: ['technology', 'home automation', 'smart home'] },
  { sub: 'Technology', title: 'Samsung foldables are now outselling their flagship S series', desc: 'Samsung reported that the Galaxy Z Fold and Flip lines now account for more revenue than the S24 Ultra. The foldable form factor has clearly moved beyond niche territory.', topics: ['technology', 'samsung', 'smartphones'] },
  { sub: 'Technology', title: 'The USB-C universal charging mandate goes into effect today', desc: 'As of today, all portable electronics sold globally must use USB-C for charging. Apple already switched the iPhone last year. The era of proprietary chargers is officially over.', topics: ['technology', 'usb-c', 'standards'] },
  { sub: 'Technology', title: 'Starlink now offers 500 Mbps in urban areas', desc: 'SpaceX rolled out a new Starlink tier offering 500 Mbps with sub-20ms latency in major cities. At $90/month, it is competitive with fiber in areas where fiber is unreliable.', topics: ['technology', 'starlink', 'internet'] },

  // ── Space (13 posts) ────────────────────────────────────
  { sub: 'Space', title: 'NASA confirms water ice deposits on the lunar south pole', desc: 'Using data from the Lunar Reconnaissance Orbiter and ground-based radar, NASA has confirmed significant water ice deposits in permanently shadowed craters. This makes a sustained lunar base much more feasible.', topics: ['science', 'space', 'nasa'] },
  { sub: 'Space', title: 'SpaceX Starship completes its first orbital flight successfully', desc: 'After years of testing and multiple failures, Starship completed a full orbital flight and returned both stages. The booster was caught by the chopsticks tower. Historic day for spaceflight.', topics: ['science', 'space', 'spacex'] },
  { sub: 'Space', title: 'James Webb discovers an Earth-like exoplanet with atmospheric oxygen', desc: 'JWST has detected molecular oxygen and water vapor in the atmosphere of a rocky exoplanet orbiting a nearby star. While not definitive proof of life, it is the strongest biosignature candidate we have found.', topics: ['science', 'space', 'jwst'] },
  { sub: 'Space', title: 'The Voyager 1 probe just sent an unexpected signal after months of silence', desc: 'Engineers at JPL received a coherent data burst from Voyager 1 after 4 months of garbled transmissions. The probe appears to have autonomously switched to a backup system. It is now 15 billion miles away.', topics: ['science', 'space', 'voyager'] },
  { sub: 'Space', title: 'China lands its rover on the far side of Mars', desc: 'China Tianwen-3 mission successfully soft-landed a rover on Mars Utopia Planitia far side. It carries a sample return capsule and will attempt to bring Mars soil back to Earth by 2030.', topics: ['science', 'space', 'mars'] },
  { sub: 'Space', title: 'Incredible photo of Saturn rings taken by amateur astronomer', desc: 'An amateur astronomer using a 14-inch Dobsonian telescope captured a stunning image of Saturn with clearly visible ring divisions. The image was processed with stacking software and the result rivals professional telescopes.', topics: ['science', 'space', 'astronomy'] },
  { sub: 'Space', title: 'Blue Origin New Glenn finally reaches orbit on its second attempt', desc: 'Blue Origin New Glenn rocket reached orbit today carrying a batch of Project Kuiper satellites. The first stage landing was also successful. Jeff Bezos space company is finally delivering on its promises.', topics: ['science', 'space', 'blue origin'] },
  { sub: 'Space', title: 'The International Space Station will be deorbited in 2031', desc: 'NASA confirmed the ISS will perform a controlled deorbit in early 2031. Most of it will burn up in the atmosphere over the South Pacific. The commercial Axiom station segments will take over.', topics: ['science', 'space', 'iss'] },
  { sub: 'Space', title: 'A massive solar flare is heading toward Earth — expect auroras', desc: 'NOAA issued a G4 geomagnetic storm warning. A massive coronal mass ejection is expected to hit Earth tonight. Auroras could be visible as far south as Georgia and Spain.', topics: ['science', 'space', 'solar flare'] },
  { sub: 'Space', title: 'India ISRO successfully tests its reusable launch vehicle', desc: 'ISRO completed a successful landing test of its Reusable Launch Vehicle prototype. The RLV-TD glided back and landed autonomously after being dropped from 4.5 km altitude. India is rapidly advancing its space capabilities.', topics: ['science', 'space', 'isro'] },
  { sub: 'Space', title: 'New study suggests dark matter may not exist after all', desc: 'A team of physicists published a paper in Nature proposing that modified gravity theories can explain galaxy rotation curves without dark matter. The paper is already sparking intense debate in the astrophysics community.', topics: ['science', 'space', 'dark matter'] },
  { sub: 'Space', title: 'Astronomers detect a rogue planet drifting between stars', desc: 'Using gravitational microlensing, astronomers have confirmed a Jupiter-sized rogue planet wandering through interstellar space about 20 light-years away. It has no parent star and temperatures around -220C.', topics: ['science', 'space', 'exoplanet'] },
  { sub: 'Space', title: 'Time-lapse of the Milky Way I shot from the Atacama Desert', desc: 'Spent 3 nights in the Atacama Desert in Chile with a Sony A7S III and a star tracker. Captured 4000 frames and stitched them into a 4K time-lapse. The clarity of the sky there is beyond anything I have experienced.', topics: ['science', 'space', 'photography'] },

  // ── Gaming (14 posts) ──────────────────────────────────
  { sub: 'Gaming', title: 'GTA VI trailer 2 just dropped and it looks unbelievable', desc: 'Rockstar released the second trailer for GTA VI today. Vice City looks absolutely stunning with ray-traced reflections and incredibly detailed pedestrians. Release date confirmed for October 2026.', topics: ['gaming', 'gta', 'rockstar'] },
  { sub: 'Gaming', title: 'Elden Ring DLC Shadow of the Erdtree is a masterpiece', desc: 'Just finished the Shadow of the Erdtree DLC after 60 hours. The map design is among the best FromSoftware has ever created. The new weapon types and the final boss fight are phenomenal.', topics: ['gaming', 'elden ring', 'fromsoftware'] },
  { sub: 'Gaming', title: 'Steam Deck OLED 2 announced with double the battery life', desc: 'Valve just revealed the Steam Deck OLED 2 with a new AMD APU, 8-hour battery life, and Wi-Fi 7. Starting at $399. Pre-orders open next week.', topics: ['gaming', 'steam deck', 'valve'] },
  { sub: 'Gaming', title: 'Nintendo Switch 2 unboxing and first impressions', desc: 'Got my hands on the Switch 2 early. The screen is gorgeous at 1080p OLED, the Joy-Cons feel premium, and backwards compatibility works flawlessly. Mario Kart World is the real star though — 4K docked output.', topics: ['gaming', 'nintendo', 'switch'] },
  { sub: 'Gaming', title: 'Why Baldurs Gate 3 ruined other RPGs for me', desc: 'After 200 hours in BG3, I cannot go back to other RPGs. The depth of choice, the companion writing, and the consequences of your actions set a new bar that nothing else matches. Larian raised the standard.', topics: ['gaming', 'rpg', 'baldurs gate'] },
  { sub: 'Gaming', title: 'I made a fully playable chess game inside Minecraft', desc: 'Used command blocks and redstone to create a working chess game in vanilla Minecraft. Each piece moves according to real chess rules and it even detects checkmate. Took me 3 months.', topics: ['gaming', 'minecraft', 'redstone'] },
  { sub: 'Gaming', title: 'PS5 Pro performance mode is a game changer for 120fps gaming', desc: 'The PS5 Pro PSSR upscaling technology is remarkable. Spider-Man 2 runs at a locked 120fps with ray tracing on. This is the definitive console experience right now.', topics: ['gaming', 'playstation', 'ps5'] },
  { sub: 'Gaming', title: 'Hollow Knight Silksong finally has a release date', desc: 'Team Cherry just announced that Hollow Knight: Silksong will launch on February 14, 2027. The trailer showed massive new areas, dozens of new bosses, and an incredible art style. The wait is almost over.', topics: ['gaming', 'hollow knight', 'indie'] },
  { sub: 'Gaming', title: 'The Witcher 4 teaser trailer shows a new protagonist', desc: 'CDPR revealed the first teaser for The Witcher 4. The protagonist appears to be Ciri, set years after the events of Wild Hunt. Built on Unreal Engine 5, the visuals are breathtaking.', topics: ['gaming', 'witcher', 'cdpr'] },
  { sub: 'Gaming', title: 'Unpopular opinion: open world games need to be smaller', desc: 'Every AAA game now has a massive open world filled with copy-paste content. I would much rather have a tight, handcrafted 20-hour experience than a 100-hour checklist simulator. Quality over quantity.', topics: ['gaming', 'game design', 'opinion'] },
  { sub: 'Gaming', title: 'My retro gaming setup: CRT TV and every console from 1985-2005', desc: 'Finally completed my retro gaming room with a Sony Trinitron CRT, original NES, SNES, N64, GameCube, PS1, PS2, and Dreamcast. Playing old games on original hardware hits differently.', topics: ['gaming', 'retro', 'consoles'] },
  { sub: 'Gaming', title: 'Counter-Strike 2 broke the all-time concurrent player record', desc: 'CS2 just hit 1.8 million concurrent players on Steam, breaking its own record. The new competitive season and map updates have brought players back in massive numbers.', topics: ['gaming', 'counter strike', 'esports'] },
  { sub: 'Gaming', title: 'How I went from Silver to Global Elite in 6 months', desc: 'Sharing my journey from Silver 2 to Global Elite in CS2. Key things that helped: aim training 30 min daily, watching pro demos, and playing with a consistent 5-stack. Detailed breakdown inside.', topics: ['gaming', 'counter strike', 'improvement'] },
  { sub: 'Gaming', title: 'Palworld sold 30 million copies and is getting a massive update', desc: 'Pocketpair announced that Palworld has hit 30 million units sold. The upcoming Sakurajima update adds 100 new Pals, a new island, and PvP battles. The game just keeps growing.', topics: ['gaming', 'palworld', 'survival'] },

  // ── Fitness (13 posts) ──────────────────────────────────
  { sub: 'Fitness', title: 'I did 100 pushups every day for a year — here are my results', desc: 'On January 1st I committed to 100 pushups daily for 365 days. My chest and triceps grew significantly, my posture improved, and my resting heart rate dropped 8 bpm. Progress photos and detailed log inside.', topics: ['health', 'fitness', 'challenge'] },
  { sub: 'Fitness', title: 'The science behind why walking 10K steps daily actually matters', desc: 'A new meta-analysis of 12 studies confirms that consistently walking 10,000 steps per day reduces all-cause mortality by 30%. The benefit plateaus around 12,000 steps. Even 7,000 steps showed significant benefits.', topics: ['health', 'fitness', 'walking'] },
  { sub: 'Fitness', title: 'My beginner gym routine that I wish someone told me about earlier', desc: 'After wasting 2 years with bro splits, I switched to a Push/Pull/Legs routine and saw more gains in 6 months than the previous 2 years. Here is the exact routine with sets, reps, and progression scheme.', topics: ['health', 'fitness', 'gym'] },
  { sub: 'Fitness', title: 'Creatine is the most underrated supplement — backed by 500+ studies', desc: 'Creatine monohydrate has more research backing it than any other supplement. It improves strength, power, brain function, and recovery. 5g daily is all you need. Here is a summary of the key studies.', topics: ['health', 'fitness', 'supplements'] },
  { sub: 'Fitness', title: 'How I lost 40 lbs in 8 months without any extreme dieting', desc: 'I lost 40 pounds by tracking calories, eating high protein, walking daily, and lifting 4 times a week. No keto, no intermittent fasting, no elimination diets. Just consistency and patience.', topics: ['health', 'fitness', 'weight loss'] },
  { sub: 'Fitness', title: 'Why you should never skip leg day — and I mean it', desc: 'Skipping legs leads to muscular imbalances, lower back pain, and terrible proportions. Your legs contain the largest muscle groups and training them boosts testosterone and growth hormone. Do your squats.', topics: ['health', 'fitness', 'strength'] },
  { sub: 'Fitness', title: 'Yoga transformed my flexibility and recovery at age 45', desc: 'Started yoga 2 years ago at 45 thinking it was too gentle to matter. My chronic back pain is gone, I can touch my toes for the first time in decades, and my lifts actually went up. Highly recommend for lifters.', topics: ['health', 'fitness', 'yoga'] },
  { sub: 'Fitness', title: 'Running my first marathon at 50 — race report', desc: 'Just completed the Chicago Marathon at age 50 with a time of 4:32:17. Training took 18 weeks. The wall hit at mile 20 but I pushed through. Most rewarding physical achievement of my life.', topics: ['health', 'fitness', 'running'] },
  { sub: 'Fitness', title: 'High protein meal prep for the week — under $50', desc: 'Here is my weekly meal prep: chicken breast, rice, roasted vegetables, Greek yogurt, and hard-boiled eggs. 180g protein per day for under $50 per week. Recipes and macros breakdown included.', topics: ['health', 'fitness', 'nutrition'] },
  { sub: 'Fitness', title: 'The best home gym equipment if you have limited space', desc: 'You can build an effective home gym in a 6x8 ft space. All you need: adjustable dumbbells, a flat bench, resistance bands, and a pull-up bar. Total cost under $300. Here is my setup.', topics: ['health', 'fitness', 'home gym'] },
  { sub: 'Fitness', title: 'Sleep is the most important factor for muscle growth', desc: 'You can train perfectly and eat perfectly, but without 7-9 hours of quality sleep, you are leaving gains on the table. Growth hormone is released during deep sleep. Here are tips to optimize your sleep.', topics: ['health', 'fitness', 'sleep'] },
  { sub: 'Fitness', title: 'Deadlift form check — am I rounding my back?', desc: 'Been deadlifting for 3 months and just hit 225 lbs. Posting a video from the side angle. I feel like my lower back rounds at the bottom. Any tips on improving form would be appreciated.', topics: ['health', 'fitness', 'form check'] },
  { sub: 'Fitness', title: 'Cold plunge vs sauna — which is better for recovery?', desc: 'After trying both for 6 months, I prefer the cold plunge for acute recovery after hard sessions and the sauna for relaxation and sleep quality. The research supports using both. Here is what the studies say.', topics: ['health', 'fitness', 'recovery'] },

  // ── Books (13 posts) ────────────────────────────────────
  { sub: 'Books', title: 'Just finished Project Hail Mary and I am speechless', desc: 'Andy Weir does it again. The humor, the science, the emotional gut punch at the end. Rocky is one of the best characters in all of science fiction. If you liked The Martian, you will love this even more.', topics: ['entertainment', 'books', 'science fiction'] },
  { sub: 'Books', title: 'What book genuinely changed the way you think?', desc: 'For me it was Thinking Fast and Slow by Daniel Kahneman. Understanding cognitive biases completely changed how I make decisions. Would love to hear what books had a similar impact on you.', topics: ['entertainment', 'books', 'philosophy'] },
  { sub: 'Books', title: 'I read 52 books in 2025 — here are my top 10', desc: 'Made it through a book-a-week challenge. My top picks: Babel, Tomorrow and Tomorrow and Tomorrow, The Name of the Wind, Piranesi, Klara and the Sun, and 5 more. Mini reviews for each inside.', topics: ['entertainment', 'books', 'reading'] },
  { sub: 'Books', title: 'Brandon Sanderson just announced a new Cosmere novel', desc: 'Sanderson revealed a new standalone Cosmere novel set on Threnody, the world of Shadows for Silence. Expected release in late 2027. The Cosmere keeps expanding and I am here for it.', topics: ['entertainment', 'books', 'fantasy'] },
  { sub: 'Books', title: 'Unpopular opinion: audiobooks count as reading', desc: 'I am tired of the gatekeeping. Audiobooks require the same comprehension and imagination. Some people learn better through listening. The format does not matter — the story and knowledge do.', topics: ['entertainment', 'books', 'opinion'] },
  { sub: 'Books', title: 'The Stormlight Archive is the greatest fantasy series ever written', desc: 'Just finished Wind and Truth, the 5th Stormlight book. The character development of Dalinar and Kaladin across 5 books is unlike anything in fantasy. Sanderson is operating on another level.', topics: ['entertainment', 'books', 'fantasy'] },
  { sub: 'Books', title: 'Best non-fiction books for understanding economics', desc: 'Looking for recommendations on economics books that are accessible to non-economists. So far I have read Freakonomics and Capital in the Twenty-First Century. What else should I read?', topics: ['entertainment', 'books', 'economics'] },
  { sub: 'Books', title: 'I built a personal library of 2000 books — here is a tour', desc: 'After 15 years of collecting, my home library has grown to over 2000 volumes across fiction, philosophy, science, and history. Built custom floor-to-ceiling shelves. Photos of each section inside.', topics: ['entertainment', 'books', 'collection'] },
  { sub: 'Books', title: 'Why 1984 is more relevant today than ever', desc: 'Re-read Orwell 1984 and the parallels to modern surveillance, doublespeak in politics, and information control are chilling. This book should be mandatory reading. Some specific examples from current events.', topics: ['entertainment', 'books', 'classic'] },
  { sub: 'Books', title: 'Dune Messiah is better than the original Dune — fight me', desc: 'Dune is the epic world-builder, but Messiah is where Herbert really challenges the reader. The deconstruction of the hero myth and the tragedy of Paul Atreides is masterful. It is criminally underrated.', topics: ['entertainment', 'books', 'science fiction'] },
  { sub: 'Books', title: 'Started a neighborhood book club and it changed my social life', desc: 'Posted a flyer at the local coffee shop and 8 people showed up to the first meeting. We have been meeting monthly for a year now. Reading becomes so much richer when you discuss it with others.', topics: ['entertainment', 'books', 'community'] },
  { sub: 'Books', title: 'The best translation of Crime and Punishment?', desc: 'Want to read Dostoevsky Crime and Punishment for the first time. There are so many translations available. Which one do you recommend — Pevear and Volokhonsky, Garnett, or Ready?', topics: ['entertainment', 'books', 'classics'] },
  { sub: 'Books', title: 'How e-readers saved my reading habit', desc: 'I went from reading 3 books a year to 30 after getting a Kindle Paperwhite. Being able to carry my entire library everywhere, instant dictionary lookups, and reading in the dark made all the difference.', topics: ['entertainment', 'books', 'technology'] },

  // ── Movies (14 posts) ──────────────────────────────────
  { sub: 'Movies', title: 'Denis Villeneuve new film looks absolutely stunning', desc: 'The first trailer for Villeneuve next project just dropped. Shot on IMAX 70mm with a Hans Zimmer score. The cinematography looks even more ambitious than Dune Part Two. This man does not miss.', topics: ['entertainment', 'movies', 'director'] },
  { sub: 'Movies', title: 'Top 10 films that everyone should watch at least once', desc: 'My list: Shawshank Redemption, Parasite, Spirited Away, The Godfather, Eternal Sunshine, Schindler List, Pulp Fiction, 2001 A Space Odyssey, Pan Labyrinth, and There Will Be Blood. What is on yours?', topics: ['entertainment', 'movies', 'recommendations'] },
  { sub: 'Movies', title: 'The Batman Part II delayed to 2027 — here is why', desc: 'Warner Bros announced The Batman sequel has been pushed to March 2027. Matt Reeves says the script went through a major rewrite to incorporate a Mr. Freeze storyline. Hoping it is worth the wait.', topics: ['entertainment', 'movies', 'batman'] },
  { sub: 'Movies', title: 'Christopher Nolan next film will be about the Cold War', desc: 'After the massive success of Oppenheimer, Nolan is reportedly developing a Cold War thriller about the Cuban Missile Crisis. Universal is once again distributing. Expected to shoot on 65mm IMAX.', topics: ['entertainment', 'movies', 'nolan'] },
  { sub: 'Movies', title: 'I watched 365 movies in 2025 — my complete ranking', desc: 'Watched exactly one movie every day for a year. Tracked everything on Letterboxd. My top 5 discoveries were all foreign films I never would have found otherwise. Full ranked list with mini reviews.', topics: ['entertainment', 'movies', 'challenge'] },
  { sub: 'Movies', title: 'Why practical effects will always look better than CGI', desc: 'Compare the Alien from 1979 to any modern CGI creature. Practical effects have weight, texture, and presence that CGI still struggles to replicate. The best films use both. Examples inside.', topics: ['entertainment', 'movies', 'effects'] },
  { sub: 'Movies', title: 'A24 is the best studio working today and it is not close', desc: 'Everything Everywhere All At Once, Hereditary, Moonlight, The Whale, Past Lives. A24 consistently takes risks on original stories and gives directors creative freedom. They are the modern gold standard.', topics: ['entertainment', 'movies', 'a24'] },
  { sub: 'Movies', title: 'Just watched Oppenheimer for the third time — still incredible', desc: 'The courtroom sequence in IMAX is one of the most intense things I have ever experienced in a theater. The sound design during the Trinity test is physically overwhelming. Nolan masterpiece.', topics: ['entertainment', 'movies', 'review'] },
  { sub: 'Movies', title: 'The Letterboxd effect: how a social app revived film culture', desc: 'Letterboxd turned movie watching from a passive activity into a community experience. The reviews are entertaining, the lists are addictive, and it is genuinely making people watch more diverse films.', topics: ['entertainment', 'movies', 'community'] },
  { sub: 'Movies', title: 'What is the scariest movie you have ever seen?', desc: 'For me it is Hereditary. The car scene made me feel physically ill and the last 20 minutes are pure nightmare fuel. Ari Aster is a master of dread. What scared you the most?', topics: ['entertainment', 'movies', 'horror'] },
  { sub: 'Movies', title: 'Marvel fatigue is real — what went wrong?', desc: 'The MCU went from Endgame, the biggest movie event in history, to struggling to hit $500M. Oversaturation, declining quality, and no clear direction are all factors. Can the franchise recover?', topics: ['entertainment', 'movies', 'marvel'] },
  { sub: 'Movies', title: 'My home theater setup: 4K projector + Dolby Atmos for under $3K', desc: 'Built a home theater in my basement with an Epson 4K projector, a 120-inch ALR screen, and a 5.1.2 Atmos speaker setup. Total cost was $2,800. Step-by-step build guide and equipment list.', topics: ['entertainment', 'movies', 'home theater'] },
  { sub: 'Movies', title: 'Studio Ghibli films ranked from worst to best', desc: 'Ranked all 24 Studio Ghibli films. Spirited Away takes the top spot but Princess Mononoke is a close second. Even the lowest ranked ones are better than most animated films. Full ranking with reasoning.', topics: ['entertainment', 'movies', 'anime'] },
  { sub: 'Movies', title: 'The best movie soundtracks of all time', desc: 'Interstellar, The Lord of the Rings, Inception, The Social Network, Blade Runner 2049. Hans Zimmer dominates but Trent Reznor and Howard Shore deserve equal praise. What are your picks?', topics: ['entertainment', 'movies', 'soundtrack'] },

  // ── Cryptocurrency (13 posts) ───────────────────────────
  { sub: 'Cryptocurrency', title: 'Bitcoin just crossed $150K — what is driving this rally?', desc: 'Bitcoin hit an all-time high of $152,000 today. The main drivers appear to be institutional ETF inflows, the recent halving effect, and growing adoption in emerging markets. Are we heading to $200K?', topics: ['business', 'cryptocurrency', 'bitcoin'] },
  { sub: 'Cryptocurrency', title: 'Ethereum 2.0 staking yields are now at 8% APR', desc: 'With the latest protocol upgrade, ETH staking rewards have increased to 8% APR. This is attracting massive capital inflows. Over 40% of all ETH is now staked. The supply squeeze is real.', topics: ['business', 'cryptocurrency', 'ethereum'] },
  { sub: 'Cryptocurrency', title: 'I accidentally sent $5,000 to the wrong wallet address', desc: 'Made a copy-paste error and sent 0.5 ETH to a random address. There is no way to reverse it. Triple-check your addresses, people. Use address book features. Learn from my expensive mistake.', topics: ['business', 'cryptocurrency', 'mistake'] },
  { sub: 'Cryptocurrency', title: 'Why DeFi lending is eating traditional banking', desc: 'DeFi protocols now hold over $200B in TVL. You can earn 6-10% on stablecoins, borrow against your crypto, and do it all without a bank. The traditional financial system is being disrupted in real time.', topics: ['business', 'cryptocurrency', 'defi'] },
  { sub: 'Cryptocurrency', title: 'The SEC finally approved spot Solana ETFs', desc: 'After years of back and forth, the SEC has approved three spot Solana ETFs. SOL surged 25% on the news. This legitimizes Solana as a major Layer 1 blockchain and opens it to institutional investors.', topics: ['business', 'cryptocurrency', 'solana'] },
  { sub: 'Cryptocurrency', title: 'My crypto portfolio strategy that survived two bear markets', desc: '70% BTC, 20% ETH, 10% altcoins. Dollar-cost average every week. Never sell in a panic. This simple strategy has outperformed every complex trading strategy I tried. Consistency wins.', topics: ['business', 'cryptocurrency', 'investing'] },
  { sub: 'Cryptocurrency', title: 'NFTs are making a comeback — but not for art', desc: 'NFTs are being used for concert tickets, real estate deeds, supply chain verification, and identity documents. The technology is solid even if the JPEG speculation era was ridiculous.', topics: ['business', 'cryptocurrency', 'nft'] },
  { sub: 'Cryptocurrency', title: 'Central Bank Digital Currencies threaten crypto privacy', desc: 'More countries are launching CBDCs with full transaction surveillance built in. This is the exact opposite of what Bitcoin was created for. The privacy vs control battle is just getting started.', topics: ['business', 'cryptocurrency', 'privacy'] },
  { sub: 'Cryptocurrency', title: 'How I earn passive income with liquidity pools', desc: 'Currently providing liquidity on Uniswap V3 for the ETH/USDC pair. Earning about $400/month with $20K deployed. Here is my strategy for managing impermanent loss and maximizing fees.', topics: ['business', 'cryptocurrency', 'yield'] },
  { sub: 'Cryptocurrency', title: 'Beginner guide: how to set up a hardware wallet', desc: 'If you hold more than $1,000 in crypto, you need a hardware wallet. Step-by-step guide for setting up a Ledger Nano X: unboxing, firmware update, seed phrase backup, and transferring your first coins.', topics: ['business', 'cryptocurrency', 'security'] },
  { sub: 'Cryptocurrency', title: 'The environmental impact of crypto mining has dropped 60%', desc: 'A new Cambridge study shows Bitcoin mining now uses 60% renewable energy, up from 25% three years ago. The narrative that crypto is killing the planet needs updating with current data.', topics: ['business', 'cryptocurrency', 'environment'] },
  { sub: 'Cryptocurrency', title: 'Layer 2 solutions finally made Ethereum usable', desc: 'With Arbitrum and Optimism, ETH transactions now cost under $0.01 and confirm in 2 seconds. Compare that to $50 fees during the 2021 bull run. Layer 2s solved the scalability problem.', topics: ['business', 'cryptocurrency', 'layer 2'] },
  { sub: 'Cryptocurrency', title: 'The biggest crypto scams of 2025 and how to avoid them', desc: 'From fake airdrops to phishing sites that clone MetaMask, scammers are getting more sophisticated. Here are the top 10 scams this year and practical tips to protect yourself.', topics: ['business', 'cryptocurrency', 'scams'] },

  // ── Nature (14 posts) ──────────────────────────────────
  { sub: 'Nature', title: 'I spent 6 hours waiting to photograph this snow leopard', desc: 'Was trekking in Ladakh and spotted a snow leopard on a ridgeline. Set up my camera and waited 6 hours in -15C for it to move into good light. This single photo made the entire trip worth it.', topics: ['science', 'nature', 'wildlife photography'] },
  { sub: 'Nature', title: 'The Amazon rainforest just had its most successful reforestation year', desc: 'Brazil reported that deforestation in the Amazon dropped 62% this year and over 2 million hectares were replanted. This is the most significant reversal in decades. There is hope.', topics: ['science', 'nature', 'environment'] },
  { sub: 'Nature', title: 'Why bees are more important than most people realize', desc: 'Bees pollinate 75% of the world food crops. Without them, agriculture as we know it would collapse within a decade. Here is what you can do in your own backyard to support local bee populations.', topics: ['science', 'nature', 'ecology'] },
  { sub: 'Nature', title: 'These mushroom photos I took after rain look alien', desc: 'Found these incredible fungi in the Pacific Northwest after a heavy rain. The colors and textures make them look like they belong on another planet. Shot with a macro lens at f/2.8.', topics: ['science', 'nature', 'photography'] },
  { sub: 'Nature', title: 'The Great Barrier Reef is showing signs of recovery', desc: 'Marine biologists report that coral cover in parts of the Great Barrier Reef has increased by 30% over the past two years. Reduced bleaching events and active restoration efforts are making a difference.', topics: ['science', 'nature', 'marine biology'] },
  { sub: 'Nature', title: 'Wolf populations in Yellowstone have reached a 20-year high', desc: 'The reintroduction of wolves to Yellowstone has been one of the most successful conservation stories. Elk behavior changed, vegetation recovered, and river courses actually shifted. A trophic cascade in action.', topics: ['science', 'nature', 'conservation'] },
  { sub: 'Nature', title: 'I hiked the entire Pacific Crest Trail in 5 months', desc: 'Just finished all 2,650 miles from Mexico to Canada. Lost 30 lbs, made lifelong friends, and saw landscapes that no photo can capture. Here is my gear list, budget breakdown, and advice for future thru-hikers.', topics: ['science', 'nature', 'hiking'] },
  { sub: 'Nature', title: 'Time-lapse of a seed growing into a plant over 30 days', desc: 'Set up a Raspberry Pi camera to take one photo every 30 minutes of a bean seed in a clear container. Watching the roots spread and the stem push through the soil is mesmerizing.', topics: ['science', 'nature', 'gardening'] },
  { sub: 'Nature', title: 'The northern lights were visible from my backyard last night', desc: 'Thanks to the massive solar storm, the aurora borealis was visible from New Jersey last night. Shot these photos with just an iPhone 15 Pro. The sky turned green and purple. Absolutely magical.', topics: ['science', 'nature', 'aurora'] },
  { sub: 'Nature', title: 'Deep ocean creatures discovered at 8,000 meters depth', desc: 'A research submersible filmed new species of translucent fish and bioluminescent jellyfish at nearly 8 km depth in the Mariana Trench. We have explored less than 5% of the ocean. The footage is incredible.', topics: ['science', 'nature', 'ocean'] },
  { sub: 'Nature', title: 'How my backyard garden feeds my family year-round', desc: 'Started with 4 raised beds and now produce enough vegetables to feed a family of 4 through all seasons using a small greenhouse and preservation techniques. Annual seed cost is about $50.', topics: ['science', 'nature', 'gardening'] },
  { sub: 'Nature', title: 'The oldest tree in the world is over 5,000 years old', desc: 'Methuselah, a bristlecone pine in California, has been alive since before the pyramids were built. Its exact location is kept secret to protect it. These trees grow in the harshest conditions on Earth.', topics: ['science', 'nature', 'trees'] },
  { sub: 'Nature', title: 'Climate change is shifting bird migration patterns significantly', desc: 'A 20-year study shows that many bird species are migrating 2-3 weeks earlier than they did in 2000. Some species have shifted their range hundreds of miles north. The ecological implications are significant.', topics: ['science', 'nature', 'climate'] },
  { sub: 'Nature', title: 'Underwater photo of a whale shark that took my breath away', desc: 'Was snorkeling in the Philippines when a 30-foot whale shark swam directly underneath me. The pattern on its skin and the sheer scale of the animal is humbling. Shot with a GoPro Hero 12.', topics: ['science', 'nature', 'marine life'] },

  // ── Programming (14 posts) ─────────────────────────────
  { sub: 'Programming', title: 'I built a full-stack app in a weekend using AI coding assistants', desc: 'Used Cursor IDE with Claude to build a complete project management app in 48 hours. Auth, CRUD, real-time updates, and deployment. AI did not write perfect code but it 10x my productivity.', topics: ['technology', 'programming', 'ai'] },
  { sub: 'Programming', title: 'Why Rust is worth learning even if you never use it professionally', desc: 'Learning Rust taught me more about memory management, ownership, and concurrency than 10 years of Python and JavaScript combined. The concepts transfer to every language you use.', topics: ['technology', 'programming', 'rust'] },
  { sub: 'Programming', title: 'The best way to learn programming is to build things you actually want', desc: 'Tutorials and courses are fine for basics, but real learning happens when you build something you care about. My first real project was a Discord bot for my friend group. That taught me more than any course.', topics: ['technology', 'programming', 'learning'] },
  { sub: 'Programming', title: 'PostgreSQL vs MongoDB — when to use which', desc: 'After using both extensively: use Postgres when you need ACID transactions, complex queries, and relational data. Use MongoDB for rapid prototyping, document-centric data, and when schema flexibility matters.', topics: ['technology', 'programming', 'databases'] },
  { sub: 'Programming', title: 'My VS Code extensions that I cannot live without', desc: 'After years of refining my setup: GitLens, Error Lens, Thunder Client, Prettier, ESLint, GitHub Copilot, TODO Highlight, and indent-rainbow. Each one saves me time daily. What are yours?', topics: ['technology', 'programming', 'tools'] },
  { sub: 'Programming', title: 'How I landed a $200K remote dev job with no CS degree', desc: 'Self-taught developer here. Built a portfolio of 5 solid projects, contributed to open source, and networked on Twitter. After 200 applications, got an offer from a Series B startup. The process took 14 months.', topics: ['technology', 'programming', 'career'] },
  { sub: 'Programming', title: 'Docker explained like you are five', desc: 'Imagine your app is a toy. Docker puts the toy in a special box that includes everything it needs to work: batteries, instructions, the right screwdriver. Anyone who has that box can play with the toy exactly the same way.', topics: ['technology', 'programming', 'docker'] },
  { sub: 'Programming', title: 'TypeScript vs JavaScript — the debate is over', desc: 'TypeScript has won. The type safety, better IDE support, and catch-bugs-before-runtime benefits are enormous. Every major JS framework now recommends TS. If you are still writing plain JS in 2026, switch now.', topics: ['technology', 'programming', 'typescript'] },
  { sub: 'Programming', title: 'I refactored 50,000 lines of legacy code and lived to tell the tale', desc: 'Inherited a 10-year-old PHP monolith with no tests. Spent 6 months adding tests, then 4 months migrating to Laravel. Documented every lesson learned. The biggest takeaway: always add tests first.', topics: ['technology', 'programming', 'refactoring'] },
  { sub: 'Programming', title: 'Git commands every developer should know beyond push and pull', desc: 'Git rebase, cherry-pick, bisect, stash, reflog, and interactive rebase. These commands will save you hours of debugging and make you look like a wizard. Quick guide with real-world examples for each.', topics: ['technology', 'programming', 'git'] },
  { sub: 'Programming', title: 'System design interview prep — my complete study plan', desc: 'Preparing for system design interviews at FAANG. My study plan: Designing Data-Intensive Applications book, Alex Xu System Design Interview, and practicing 2 designs per week on a whiteboard. 8-week plan inside.', topics: ['technology', 'programming', 'interviews'] },
  { sub: 'Programming', title: 'The 10 most common React mistakes beginners make', desc: 'Mutating state directly, not using keys in lists, creating too many useEffects, prop drilling instead of context, not memoizing expensive computations. Full list with code examples and fixes.', topics: ['technology', 'programming', 'react'] },
  { sub: 'Programming', title: 'Why I prefer Vim keybindings in every editor I use', desc: 'Once you learn Vim motions, you can never go back. The ability to navigate and edit without touching the mouse is addictive. I use Vim bindings in VS Code, IntelliJ, and even my browser.', topics: ['technology', 'programming', 'vim'] },
  { sub: 'Programming', title: 'How to write clean code — lessons from 15 years of development', desc: 'Name variables clearly, keep functions under 20 lines, write tests before code, avoid premature optimization, and refactor mercilessly. These principles have served me well across 6 companies.', topics: ['technology', 'programming', 'best practices'] },

  // ── Food (13 posts) ─────────────────────────────────────
  { sub: 'Food', title: 'I perfected my pizza dough recipe after 2 years of experiments', desc: 'After testing 50+ recipes, this is my final pizza dough formula: 65% hydration, 00 flour, 3% olive oil, 24-hour cold ferment. The result is crispy, chewy, and airy. Full recipe with photos of each step.', topics: ['entertainment', 'food', 'cooking'] },
  { sub: 'Food', title: 'The best ramen I have ever had was in a tiny shop in Tokyo', desc: 'Found a 6-seat ramen shop in Shinjuku where the chef has been making tonkotsu ramen for 40 years. The broth was creamy, rich, and impossibly flavorful. Waited 2 hours but it was worth every minute.', topics: ['entertainment', 'food', 'japan'] },
  { sub: 'Food', title: 'Budget meals: eating well on $30 per week', desc: 'Rice, beans, eggs, frozen vegetables, oats, and bananas form the base. Add spices and sauces for variety. Here are 7 days of meals with recipes that keep you under $30 while hitting macro targets.', topics: ['entertainment', 'food', 'budget'] },
  { sub: 'Food', title: 'Why fermented foods should be part of your daily diet', desc: 'Kimchi, sauerkraut, yogurt, and kombucha provide probiotics that support gut health, immune function, and even mental health. The research on the gut-brain axis is fascinating. Start with one serving daily.', topics: ['entertainment', 'food', 'health'] },
  { sub: 'Food', title: 'I smoked a brisket for 16 hours and it was life-changing', desc: 'Used a simple salt and pepper rub on a 14-lb prime brisket. Smoked at 225F on an offset smoker with post oak. The bark was perfect and the flat was juicier than any restaurant brisket I have had.', topics: ['entertainment', 'food', 'bbq'] },
  { sub: 'Food', title: 'Gordon Ramsay scrambled eggs technique actually works', desc: 'Tried the famous low and slow method with constant stirring and crème fraîche. The result is the creamiest, most luxurious scrambled eggs I have ever made. Takes 10 minutes but absolutely worth it.', topics: ['entertainment', 'food', 'technique'] },
  { sub: 'Food', title: 'What is your controversial food opinion?', desc: 'I will start: ketchup on steak is fine if you enjoy it. Food gatekeeping is pointless. Eat what makes you happy. Now let me hear yours — the spicier the take, the better.', topics: ['entertainment', 'food', 'discussion'] },
  { sub: 'Food', title: 'How to make authentic Thai green curry at home', desc: 'Most restaurant Thai curry uses pre-made paste, but making it from scratch with fresh lemongrass, galangal, and Thai basil is a revelation. Here is my authentic recipe learned from a cooking class in Chiang Mai.', topics: ['entertainment', 'food', 'thai'] },
  { sub: 'Food', title: 'The chemistry behind why cast iron pans are the best', desc: 'Cast iron seasoning is a layer of polymerized oil that creates a natural non-stick surface. It gets better with use, distributes heat evenly, and lasts literally forever. Here is how to properly season one.', topics: ['entertainment', 'food', 'cookware'] },
  { sub: 'Food', title: 'I ate street food in every country I visited in Southeast Asia', desc: 'Spent 3 months eating street food across Thailand, Vietnam, Cambodia, and Indonesia. Pad thai for $1, pho for $2, banh mi for $1.50. The best food is always on the street. Photo diary with prices.', topics: ['entertainment', 'food', 'travel'] },
  { sub: 'Food', title: 'Sourdough bread baking has become my therapy', desc: 'Started during lockdown and never stopped. The ritual of feeding the starter, shaping the dough, and scoring the loaf is meditative. Each loaf is slightly different. Photos of my best bakes this month.', topics: ['entertainment', 'food', 'baking'] },
  { sub: 'Food', title: 'Best coffee brewing method: pour-over vs espresso vs French press', desc: 'After years of trying everything, pour-over gives the cleanest flavor, espresso the most intense, and French press the most body. The best method depends on the bean. My guide to matching beans to methods.', topics: ['entertainment', 'food', 'coffee'] },
  { sub: 'Food', title: 'MSG is not bad for you — the science is clear', desc: 'The fear of MSG is based on a single debunked anecdote from 1968. Hundreds of studies have found it to be completely safe. It is literally just a sodium salt of glutamic acid, which is in tomatoes and parmesan.', topics: ['entertainment', 'food', 'science'] },

  // ── History (13 posts) ──────────────────────────────────
  { sub: 'History', title: 'What is the most fascinating historical fact you know?', desc: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid. The pyramids were ancient even to the ancient Egyptians. History is mind-bogglingly long.', topics: ['politics', 'history', 'facts'] },
  { sub: 'History', title: 'The fall of the Roman Empire was not a single event', desc: 'The western Roman Empire declined over centuries through economic crisis, military overextension, political corruption, and barbarian migrations. There was no single dramatic collapse — it was a slow erosion.', topics: ['politics', 'history', 'rome'] },
  { sub: 'History', title: 'Genghis Khan empire was more sophisticated than most people think', desc: 'Beyond conquest, the Mongol Empire established religious freedom, a postal system spanning continents, meritocratic government, and international trade routes. The Pax Mongolica enabled unprecedented cultural exchange.', topics: ['politics', 'history', 'mongol empire'] },
  { sub: 'History', title: 'The Library of Alexandria — what was actually lost?', desc: 'Contrary to popular belief, the Library of Alexandria did not burn in a single catastrophic event. It declined gradually over centuries. Many texts survived through copies. But significant unique works were indeed lost forever.', topics: ['politics', 'history', 'ancient'] },
  { sub: 'History', title: 'How the Black Death reshaped European society permanently', desc: 'The plague killed 30-60% of Europe population. The resulting labor shortage gave workers leverage, helping end serfdom. Wages rose, social mobility increased, and it arguably accelerated the Renaissance.', topics: ['politics', 'history', 'plague'] },
  { sub: 'History', title: 'The most underrated civilization in history: the Indus Valley', desc: 'The Indus Valley Civilization had advanced urban planning, sewage systems, standardized weights, and a writing system we still cannot decode. At its peak, it was larger than Egypt and Mesopotamia combined.', topics: ['politics', 'history', 'civilization'] },
  { sub: 'History', title: 'Why did Japan isolate itself for 200 years?', desc: 'The Tokugawa shogunate implemented Sakoku policy from 1633 to 1853, severely limiting foreign contact. The motivations included controlling Christianity, maintaining political stability, and preventing foreign interference.', topics: ['politics', 'history', 'japan'] },
  { sub: 'History', title: 'The true story behind the Trojan War', desc: 'Archaeological evidence suggests Troy was a real city destroyed around 1180 BC. While Homer account is literary, the geopolitical tensions between Mycenaean Greeks and Anatolian powers were real.', topics: ['politics', 'history', 'ancient greece'] },
  { sub: 'History', title: 'How the printing press changed everything', desc: 'Gutenberg printing press in 1440 was arguably the most important invention in human history. It democratized knowledge, enabled the Reformation, sparked the Scientific Revolution, and eventually led to democracy.', topics: ['politics', 'history', 'technology'] },
  { sub: 'History', title: 'What life was really like for a medieval peasant', desc: 'Contrary to popular belief, medieval peasants had about 150 holidays per year, had communal support systems, and ate a more varied diet than most assume. Life was hard, but not the unrelenting misery films depict.', topics: ['politics', 'history', 'medieval'] },
  { sub: 'History', title: 'The Cold War space race was driven as much by propaganda as science', desc: 'Both the US and USSR saw space achievements primarily as propaganda tools. The moon landing was as much about proving ideological superiority as scientific discovery. The technology was a byproduct.', topics: ['politics', 'history', 'space'] },
  { sub: 'History', title: 'Ancient Egyptian medicine was surprisingly advanced', desc: 'Egyptian physicians performed surgeries, set broken bones, and used honey as an antibiotic (which actually works). The Edwin Smith Papyrus from 1600 BC describes 48 surgical cases with rational treatments.', topics: ['politics', 'history', 'medicine'] },
  { sub: 'History', title: 'The Silk Road was the ancient internet', desc: 'The Silk Road network spread not just goods, but ideas, religions, technologies, and diseases across continents. Buddhism spread to China, papermaking reached Europe, and plagues traveled with merchants.', topics: ['politics', 'history', 'trade'] },

  // ── Music (13 posts) ────────────────────────────────────
  { sub: 'Music', title: 'Kendrick Lamar new album might be his best work yet', desc: 'Just listened to the new album 5 times through. The production is experimental, the lyrics are deeply personal, and every track flows perfectly into the next. This is a strong AOTY contender.', topics: ['entertainment', 'music', 'hip hop'] },
  { sub: 'Music', title: 'I learned guitar in 1 year — here is my practice routine', desc: 'Started from zero and can now play most intermediate songs. 30 minutes daily: 10 min scales, 10 min chord transitions, 10 min learning a song. Consistency beats marathon sessions. Progress videos included.', topics: ['entertainment', 'music', 'guitar'] },
  { sub: 'Music', title: 'Why vinyl is making a massive comeback', desc: 'Vinyl sales surpassed CD sales for the first time since 1987. It is not just nostalgia — the physicality, the artwork, the ritual of putting a record on all contribute to a more intentional listening experience.', topics: ['entertainment', 'music', 'vinyl'] },
  { sub: 'Music', title: 'The greatest album of each decade from the 1960s to 2020s', desc: '60s: Abbey Road. 70s: Rumours. 80s: Thriller. 90s: OK Computer. 00s: Kid A. 10s: To Pimp a Butterfly. 20s: still being decided. Would love to hear your picks and arguments.', topics: ['entertainment', 'music', 'albums'] },
  { sub: 'Music', title: 'How music streaming killed the album format', desc: 'When singles drive streams, artists have less incentive to create cohesive albums. The art of track sequencing, interludes, and thematic arcs is dying. Some artists still prioritize albums but they are increasingly rare.', topics: ['entertainment', 'music', 'streaming'] },
  { sub: 'Music', title: 'My home studio setup for under $500 — it sounds professional', desc: 'Audio interface (Focusrite Scarlett), condenser mic (AT2020), studio monitors (PreSonus Eris), headphones (ATH-M50x), and DAW (Reaper — free). You can make radio-quality recordings with this budget.', topics: ['entertainment', 'music', 'production'] },
  { sub: 'Music', title: 'Why classical music deserves more respect from younger generations', desc: 'Classical music is not boring — it is some of the most emotionally intense art ever created. Listen to Beethoven 7th Symphony 2nd movement, Barber Adagio for Strings, or Debussy Clair de Lune and tell me you feel nothing.', topics: ['entertainment', 'music', 'classical'] },
  { sub: 'Music', title: 'The best live concert experience I have ever had', desc: 'Saw Radiohead at Glastonbury in the pouring rain. When they played Everything in Its Right Place, 80,000 people went completely silent. Then the chorus hit and it was pure catharsis. Music is meant to be experienced live.', topics: ['entertainment', 'music', 'concerts'] },
  { sub: 'Music', title: 'AI-generated music is getting scary good', desc: 'The latest Suno and Udio models can generate full songs with vocals that sound genuinely human. It is impressive and terrifying. What does this mean for independent musicians? The debate is heating up.', topics: ['entertainment', 'music', 'ai'] },
  { sub: 'Music', title: 'Jazz is the most technically demanding genre and it is not close', desc: 'The level of improvisation, harmonic knowledge, and rhythmic complexity required for jazz is unmatched. A jazz musician needs to compose in real-time while interacting with their band. It is musical chess.', topics: ['entertainment', 'music', 'jazz'] },
  { sub: 'Music', title: 'Headphone recommendation: I tested 20 pairs under $200', desc: 'After testing 20 headphones in the sub-$200 range, my top picks are: Sony WH-1000XM4 (ANC), Sennheiser HD560S (open-back), and Moondrop Starfield (IEM). Detailed comparison chart inside.', topics: ['entertainment', 'music', 'audio'] },
  { sub: 'Music', title: 'Learning music theory made me appreciate songs on a deeper level', desc: 'Understanding chord progressions, modes, and song structure completely changed how I listen to music. I can now hear why certain songs hit emotionally and it makes the experience richer not clinical.', topics: ['entertainment', 'music', 'theory'] },
  { sub: 'Music', title: 'The most underrated bands of the 2000s', desc: 'Bloc Party, TV on the Radio, Interpol, The Walkmen, Spoon. These bands made incredible music that never got the mainstream attention they deserved. If you have not listened to them, start with Silent Alarm.', topics: ['entertainment', 'music', 'bands'] },

  // ── Travel (13 posts) ──────────────────────────────────
  { sub: 'Travel', title: 'I traveled to 30 countries on a $15K annual budget', desc: 'Slow travel is the key. I stay in each country for at least 3 weeks, use local transport, cook my own meals, and house-sit. My average daily spend is about $40 including accommodation. Detailed budget breakdown.', topics: ['entertainment', 'travel', 'budget'] },
  { sub: 'Travel', title: 'Japan is even better than everyone says', desc: 'Spent 3 weeks in Japan and it exceeded every expectation. The food, the trains, the cleanliness, the kindness of people, the temples. Every single day was incredible. Here is my itinerary.', topics: ['entertainment', 'travel', 'japan'] },
  { sub: 'Travel', title: 'The 10 best hidden gem destinations in Europe', desc: 'Skip Paris and Barcelona. Go to Kotor in Montenegro, Colmar in France, Sintra in Portugal, Hallstatt in Austria, and 6 more stunning but less crowded alternatives. Each one is magical.', topics: ['entertainment', 'travel', 'europe'] },
  { sub: 'Travel', title: 'Solo travel changed my life at 25', desc: 'Was terrified to travel alone. Booked a one-way ticket to Thailand and spent 4 months across Southeast Asia. The confidence, independence, and perspective I gained were worth more than any degree.', topics: ['entertainment', 'travel', 'solo'] },
  { sub: 'Travel', title: 'My complete packing list for a 3-month backpacking trip', desc: 'Everything fits in a 40L backpack: 5 shirts, 2 pants, 1 jacket, toiletries, electronics, first aid kit. Total weight: 8 kg. The key is merino wool clothing that resists odor and dries quickly. Full list with links.', topics: ['entertainment', 'travel', 'packing'] },
  { sub: 'Travel', title: 'The most beautiful train journeys in the world', desc: 'The Glacier Express in Switzerland, the Trans-Siberian Railway, the Coastal Classic in New Zealand, and the Bergen Railway in Norway. Train travel shows you landscapes that planes and cars never can.', topics: ['entertainment', 'travel', 'trains'] },
  { sub: 'Travel', title: 'How to find cheap flights — my complete strategy', desc: 'Use Google Flights with flexible dates, set up price alerts, fly on Tuesdays, book 6-8 weeks in advance for domestic and 2-3 months for international. I regularly save 40-60% off standard prices.', topics: ['entertainment', 'travel', 'flights'] },
  { sub: 'Travel', title: 'Iceland in winter is the most surreal place on Earth', desc: 'Drove the Ring Road in January. Saw the Northern Lights 4 out of 7 nights, walked inside an ice cave, and bathed in hot springs while snow fell around us. Cold but absolutely unforgettable.', topics: ['entertainment', 'travel', 'iceland'] },
  { sub: 'Travel', title: 'The street food in Mexico City rivals any Michelin restaurant', desc: 'Tacos al pastor for $1, elote with lime and chili, fresh churros with chocolate. The flavor complexity of Mexican street food is insane. Spent a week eating exclusively from street vendors.', topics: ['entertainment', 'travel', 'mexico'] },
  { sub: 'Travel', title: 'Why I will never go on a cruise again', desc: 'The environmental damage, the overcrowded ports, the mediocre food, and the lack of cultural immersion make cruises the worst way to travel. You see nothing real and contribute to overtourism.', topics: ['entertainment', 'travel', 'opinion'] },
  { sub: 'Travel', title: 'Learning basic phrases in the local language goes a long way', desc: 'Even just knowing hello, thank you, please, and excuse me in the local language completely changes how people treat you. Downloaded Duolingo 2 weeks before every trip. People appreciate the effort.', topics: ['entertainment', 'travel', 'language'] },
  { sub: 'Travel', title: 'My photography tips for capturing better travel photos', desc: 'Shoot during golden hour, include people for scale, get off the beaten path, and edit consistently. Most importantly put the camera down sometimes and just experience the moment.', topics: ['entertainment', 'travel', 'photography'] },
  { sub: 'Travel', title: 'The best travel credit cards for maximizing points in 2026', desc: 'Chase Sapphire Reserve, Amex Gold, and Capital One Venture X are my top 3. Between sign-up bonuses and category spending, I earned enough points for 3 international round trips this year.', topics: ['entertainment', 'travel', 'finance'] },

  // ── Science (14 posts) ─────────────────────────────────
  { sub: 'Science', title: 'Scientists just created the first room-temperature superconductor that works', desc: 'Unlike the LK-99 fiasco, this new material has been independently replicated by 5 labs. It operates at 1 atm pressure and 22°C. If it can be mass-produced, it will revolutionize energy transmission.', topics: ['science', 'physics', 'superconductor'] },
  { sub: 'Science', title: 'CRISPR gene therapy just cured sickle cell disease in clinical trials', desc: 'A landmark clinical trial showed that CRISPR-based therapy completely eliminated sickle cell crises in 95% of patients over 3 years. This is the first genetic disease effectively cured by gene editing.', topics: ['science', 'genetics', 'crispr'] },
  { sub: 'Science', title: 'Fusion energy breakthrough — net positive energy sustained for 5 minutes', desc: 'A fusion reactor in France sustained net positive energy output for a full 5 minutes, producing 11MJ more energy than consumed. Previous records were measured in seconds. Commercial fusion by 2035 now plausible.', topics: ['science', 'energy', 'fusion'] },
  { sub: 'Science', title: 'Why do we dream? A new theory finally makes sense', desc: 'A new paper proposes that dreaming serves as a threat simulation system, allowing the brain to rehearse responses to danger in a safe environment. This explains why most dreams involve anxiety or conflict.', topics: ['science', 'neuroscience', 'dreams'] },
  { sub: 'Science', title: 'The human brain is the most complex object in the known universe', desc: '86 billion neurons, each with up to 10,000 synaptic connections. More connections than stars in the Milky Way. And somehow this wet 3-pound organ produces consciousness. Neuroscience is humbling.', topics: ['science', 'neuroscience', 'brain'] },
  { sub: 'Science', title: 'New antibiotic discovered that kills drug-resistant bacteria', desc: 'Researchers extracted a compound from soil bacteria that kills MRSA and other antibiotic-resistant pathogens. In animal models, it showed zero resistance development over 30 days. Human trials starting next year.', topics: ['science', 'medicine', 'antibiotics'] },
  { sub: 'Science', title: 'The Mpemba Effect: why hot water sometimes freezes faster than cold', desc: 'A phenomenon known since Aristotle finally has a theoretical explanation. New research suggests that hydrogen bond interactions in hot water create a unique crystallization pathway. The physics of water remains surprising.', topics: ['science', 'physics', 'water'] },
  { sub: 'Science', title: 'AI just predicted the structure of every known protein', desc: 'AlphaFold 3 has now predicted the structure of every catalogued protein from every known organism — over 200 million structures. This database is freely available and is accelerating drug discovery worldwide.', topics: ['science', 'biology', 'ai'] },
  { sub: 'Science', title: 'Why the octopus might be the most intelligent invertebrate', desc: 'Octopuses can solve puzzles, use tools, recognize individual humans, and escape from seemingly impossible enclosures. They have 500 million neurons distributed across 9 brains. Their intelligence evolved completely independently from ours.', topics: ['science', 'biology', 'animals'] },
  { sub: 'Science', title: 'The quantum computing milestone everyone missed', desc: 'IBM quantum computer just solved a materials science problem in 4 minutes that would take a classical supercomputer 10,000 years. This is the first genuinely useful quantum computation. The era of quantum advantage has begun.', topics: ['science', 'physics', 'quantum'] },
  { sub: 'Science', title: 'How bacteria in your gut influence your mood and decisions', desc: 'The gut microbiome produces 90% of the body serotonin and directly communicates with the brain via the vagus nerve. Studies show that changing gut bacteria can reduce anxiety. The gut is literally a second brain.', topics: ['science', 'biology', 'microbiome'] },
  { sub: 'Science', title: 'Tardigrades can survive in space — how do they do it?', desc: 'These microscopic animals can withstand vacuum, radiation, extreme temperatures, and pressures 6x the deepest ocean. They produce a unique glass-like protein that protects their cells. Evolution produced an indestructible animal.', topics: ['science', 'biology', 'tardigrades'] },
  { sub: 'Science', title: 'The placebo effect is getting stronger and no one knows why', desc: 'Clinical trials show the placebo effect has grown 30% stronger since the 1990s, but only in the US. Larger pills work better than smaller ones, and injections work better than pills. The mind body connection is real.', topics: ['science', 'medicine', 'placebo'] },
  { sub: 'Science', title: 'We are living in a golden age of scientific discovery', desc: 'CRISPR, AI protein folding, room-temp superconductors, gravitational waves, mRNA vaccines, fusion energy. More paradigm-shifting discoveries have happened in the last 10 years than in any previous decade. Appreciate it.', topics: ['science', 'progress', 'discovery'] },

  // ── Art (13 posts) ─────────────────────────────────────
  { sub: 'Art', title: 'I drew one portrait every day for 365 days — here is my progression', desc: 'Started January 1st drawing terrible stick figures. By day 100, basic proportions. By day 200, realistic shading. By day 365, I am producing portraits I am genuinely proud of. Daily practice works. Gallery inside.', topics: ['entertainment', 'art', 'drawing'] },
  { sub: 'Art', title: 'The debate over AI art needs more nuance', desc: 'AI art tools are not replacing artists any more than cameras replaced painters. They are a new medium. The real issue is training data consent and compensation. We can embrace the technology while protecting creators.', topics: ['entertainment', 'art', 'ai'] },
  { sub: 'Art', title: 'Why every programmer should learn basic design principles', desc: 'Understanding color theory, typography, spacing, and hierarchy will make your code projects look 10x better. You do not need to be an artist. Just knowing the basics puts you ahead of 90% of developers.', topics: ['entertainment', 'art', 'design'] },
  { sub: 'Art', title: 'My watercolor painting of a Japanese garden', desc: 'Spent 3 days on this A3 watercolor inspired by the gardens of Kyoto. The most challenging part was the water reflections — watercolor is beautifully unpredictable. Scanned at 600dpi for maximum detail.', topics: ['entertainment', 'art', 'watercolor'] },
  { sub: 'Art', title: 'The best free resources for learning digital art in 2026', desc: 'Krita (free Photoshop alternative), Drawabox (fundamentals), Proko (anatomy on YouTube), and ctrl+paint (digital painting basics). You can go from zero to competent without spending a dollar.', topics: ['entertainment', 'art', 'resources'] },
  { sub: 'Art', title: 'How Impressionism revolutionized the art world', desc: 'Before Monet and Renoir, art was about precise representation. The Impressionists prioritized light, color, and emotion over accuracy. They were rejected by every salon before changing art forever.', topics: ['entertainment', 'art', 'history'] },
  { sub: 'Art', title: 'I turned my apartment into an art gallery', desc: 'Collected prints and originals from local artists over 5 years. Proper lighting, consistent framing, and gallery-style hanging transformed my apartment. Total investment about $2,000. Virtual tour inside.', topics: ['entertainment', 'art', 'collection'] },
  { sub: 'Art', title: 'Procreate tips that took my iPad art to the next level', desc: 'Alpha lock for shading, clipping masks for non-destructive editing, gesture controls for undo, and custom brush creation. These features are game-changers. Detailed tutorial with examples.', topics: ['entertainment', 'art', 'digital'] },
  { sub: 'Art', title: 'Street art is the most democratic art form', desc: 'Unlike galleries that cater to the wealthy, street art is free and accessible to everyone. From Banksy to local muralists, the streets are the world largest gallery. Some of the best art I have seen was on random walls.', topics: ['entertainment', 'art', 'street art'] },
  { sub: 'Art', title: 'The psychology of color — why certain colors make you feel certain ways', desc: 'Red increases heart rate, blue promotes calm, yellow stimulates creativity. Color psychology is used extensively in marketing and interior design. Understanding it will improve your art and design work.', topics: ['entertainment', 'art', 'color theory'] },
  { sub: 'Art', title: 'Museum visit: the Louvre is overwhelming but magical', desc: 'Spent 2 full days at the Louvre and still only saw 30% of it. The Mona Lisa is surprisingly small but Winged Victory of Samothrace is breathtaking in person. Skip the crowds and go straight to the Egyptian wing.', topics: ['entertainment', 'art', 'museums'] },
  { sub: 'Art', title: 'Pixel art is having a renaissance and I am here for it', desc: 'Games like Celeste, Hyper Light Drifter, and Eastward prove that pixel art can be as beautiful as any AAA graphics. The constraint of working with limited pixels forces incredible creativity.', topics: ['entertainment', 'art', 'pixel art'] },
  { sub: 'Art', title: 'How to develop your own art style — it takes time', desc: 'Your style is not something you choose — it emerges from practicing fundamentals and absorbing influences. Draw a lot, study artists you admire, experiment constantly, and eventually your unique voice appears.', topics: ['entertainment', 'art', 'style'] },
];

// ─── Insert Posts ──────────────────────────────────────────
console.log(`📝 Inserting ${postData.length} posts...`);

const usernames = createdUsers.map(u => u.username);
let insertedCount = 0;

for (let i = 0; i < postData.length; i++) {
  const p = postData[i];
  const author = usernames[i % usernames.length];
  const votes = Math.floor(Math.random() * 500) + 1;
  const view_count = Math.floor(Math.random() * 2000) + votes;

  try {
    const post = await Post.create({
      author,
      subreddit: p.sub,
      title: p.title,
      desc: p.desc,
      votes,
      view_count,
      topics: p.topics,
    });

    // Update subreddit's Posts array
    await Subreddit.findOneAndUpdate(
      { name: p.sub },
      { $push: { Posts: post._id } }
    );

    // Update author's profile
    await Profile.findOneAndUpdate(
      { username: author },
      {
        $push: {
          postsCreated: post._id,
          recentPosts: { $each: [post._id], $slice: -10 },
        },
        $inc: { PostKarma: 1 },
      },
      { upsert: true }
    );

    insertedCount++;
  } catch (err) {
    // skip duplicates or errors silently
    console.log(`  ⚠ Skipped post ${i + 1}: ${err.message.substring(0, 60)}`);
  }
}

console.log(`✅ Successfully inserted ${insertedCount} posts`);
console.log('🎉 Seeding complete!');

await mongoose.disconnect();
process.exit(0);
