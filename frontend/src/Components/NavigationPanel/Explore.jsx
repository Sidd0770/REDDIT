import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSubreddits } from '../../services/operations/subredditAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCompass, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Explore = () => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllSubreddits()
            .then((data) => {
                setCommunities(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch communities", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-[calc(100vh-76px)]'>
                <div className='w-12 h-12 rounded-full border-4 border-[#343536] border-t-[#ff4500] animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='overflow-y-auto h-[calc(100vh-76px)] pb-12 pr-2 animate-fade-in'>
            {/* Header section */}
            <div className='mb-8 mt-2'>
                <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 rounded-full bg-[#ff4500]/10 flex items-center justify-center text-[#ff4500]'>
                        <FontAwesomeIcon icon={faCompass} className='text-xl' />
                    </div>
                    <h1 className='text-2xl font-bold text-[#d7dadc] tracking-tight'>Explore Communities</h1>
                </div>
                <p className='text-[#818384] text-sm max-w-2xl'>
                    Discover new topics, join discussions, and find your people. Here are all the active communities available to join.
                </p>
            </div>

            {/* Communities Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {communities.map((community, index) => (
                    <div 
                        key={community._id} 
                        className='bg-[#1a1a1b] border border-[#343536] rounded-xl p-5 hover:border-[#d7dadc4d] transition-all duration-200 flex flex-col group cursor-pointer'
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => navigate(`/r/${community.name}`)}
                    >
                        {/* Card Header */}
                        <div className='flex items-start gap-3 mb-3'>
                            <div className='w-12 h-12 rounded-full bg-[#272729] flex items-center justify-center text-[#818384] text-lg shrink-0 overflow-hidden'>
                                {community.icon ? (
                                    <img src={community.icon} alt={community.name} className='w-full h-full object-cover' />
                                ) : (
                                    <FontAwesomeIcon icon={faUsers} />
                                )}
                            </div>
                            <div>
                                <h2 className='text-base font-bold text-[#d7dadc] group-hover:text-[#ff4500] transition-colors duration-200 truncate'>
                                    r/{community.name}
                                </h2>
                                <p className='text-xs text-[#818384] mt-0.5'>
                                    {community.members ? community.members.length : 0} Members
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className='text-sm text-[#d7dadc]/80 line-clamp-3 mb-4 flex-1'>
                            {community.description || "No description provided for this community."}
                        </p>

                        {/* Visit Button */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/r/${community.name}`);
                            }}
                            className='w-full py-2.5 rounded-full bg-[#272729] text-[#d7dadc] text-sm font-semibold hover:bg-[#343536] transition-colors duration-200 flex items-center justify-center gap-2 mt-auto'
                        >
                            Visit Community
                            <FontAwesomeIcon icon={faArrowRight} className='text-xs' />
                        </button>
                    </div>
                ))}
            </div>

            {communities.length === 0 && (
                <div className='text-center py-20 text-[#818384]'>
                    <FontAwesomeIcon icon={faUsers} className='text-4xl mb-4 opacity-50' />
                    <h3 className='text-lg font-medium text-[#d7dadc]'>No communities found</h3>
                    <p className='text-sm mt-1'>There are currently no communities available to explore.</p>
                </div>
            )}
        </div>
    );
};

export default Explore;
