diff --git a/frontend/src/components.js b/frontend/src/components.js
new file mode 100644
index 0000000..61bc06c
import React, { useState, useEffect } from 'react';
import { Search, Users, MessageSquare, Calendar, CheckCircle, Clock, AlertCircle, User, LogIn, LogOut, ExternalLink } from 'lucide-react';

// Mock petition data - currently empty
export const mockPetitions = [];

// Header Component
export const Header = ({ currentPage, setCurrentPage, user, robloxAuth }) => {
  return (
    <header className="bg-emerald-700 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="bg-white p-2 rounded">
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Petitions</h1>
                <p className="text-sm text-emerald-100">UK Government and Parliament</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-emerald-200">
                    {user.canSign ? `Rank: ${user.rank} â` : `Rank: ${user.rank} (Need rank 10+)`}
                  </p>
                </div>
                <button
                  onClick={robloxAuth.logout}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-800 px-3 py-2 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={robloxAuth.login}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Connect ROBLOX Account</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Stats Component
export const StatsSection = () => {
  const totalPetitions = mockPetitions.length;
  const openPetitions = mockPetitions.filter(p => p.status === 'open').length;
  const debatedPetitions = mockPetitions.filter(p => p.debate?.status === 'completed').length;
  const responsePetitions = mockPetitions.filter(p => p.governmentResponse).length;

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{responsePetitions}</div>
            <div className="text-gray-600">
              petitions from the current<br />
              Parliament have received a<br />
              <a 
                href="https://petition.parliament.uk/petitions?state=with_response" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                response from the Government
              </a>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{debatedPetitions}</div>
            <div className="text-gray-600">
              petitions from the current<br />
              Parliament have been debated<br />
              <a 
                href="https://petition.parliament.uk/petitions?state=debated" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                in the House of Commons
              </a>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{responsePetitions}</div>
            <div className="text-gray-600">Petitions with government responses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{totalPetitions}</div>
            <div className="text-gray-600">Total petitions in the system</div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Filter Component
export const FilterSection = ({ activeFilter, setActiveFilter, petitions }) => {
  const getFilterCounts = () => {
    return {
      all: petitions.length,
      open: petitions.filter(p => p.status === 'open').length,
      closed: petitions.filter(p => p.status === 'closed').length,
      awaiting_response: petitions.filter(p => p.signatures >= 10 && !p.governmentResponse && p.status === 'open').length,
      with_response: petitions.filter(p => p.governmentResponse).length,
      awaiting_debate: petitions.filter(p => p.signatures >= 20 && (!p.debate || p.debate.status === 'scheduled') && p.status === 'open').length,
      debated: petitions.filter(p => p.debate?.status === 'completed').length,
      not_debated: petitions.filter(p => p.signatures >= 20 && !p.debate && p.status === 'closed').length
    };
  };

  const counts = getFilterCounts();

  const filters = [
    { key: 'all', label: 'All petitions', count: counts.all },
    { key: 'open', label: 'Open petitions', count: counts.open },
    { key: 'closed', label: 'Closed petitions', count: counts.closed },
    { key: 'awaiting_response', label: 'Awaiting government response', count: counts.awaiting_response },
    { key: 'with_response', label: 'Government responses', count: counts.with_response },
    { key: 'awaiting_debate', label: 'Awaiting a debate in Parliament', count: counts.awaiting_debate },
    { key: 'debated', label: 'Debated in Parliament', count: counts.debated },
    { key: 'not_debated', label: 'Not debated in Parliament', count: counts.not_debated }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter petitions</h3>
        <div className="space-y-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center justify-between w-full px-4 py-2 text-left rounded transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`px-2 py-1 text-sm rounded ${
                activeFilter === filter.key
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// All Petitions Page Component
export const AllPetitionsPage = ({ onBack, petitions, user, onSign, onPetitionClick }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter petitions based on active filter and search
  const getFilteredPetitions = () => {
    let filtered = petitions;

    // Apply search filter first
    if (searchQuery.trim()) {
      filtered = filtered.filter(petition =>
        petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        petition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        petition.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (activeFilter) {
      case 'open':
        return filtered.filter(p => p.status === 'open');
      case 'closed':
        return filtered.filter(p => p.status === 'closed');
      case 'awaiting_response':
        return filtered.filter(p => p.signatures >= 10 && !p.governmentResponse && p.status === 'open');
      case 'with_response':
        return filtered.filter(p => p.governmentResponse);
      case 'awaiting_debate':
        return filtered.filter(p => p.signatures >= 20 && (!p.debate || p.debate.status === 'scheduled') && p.status === 'open');
      case 'debated':
        return filtered.filter(p => p.debate?.status === 'completed');
      case 'not_debated':
        return filtered.filter(p => p.signatures >= 20 && !p.debate && p.status === 'closed');
      default:
        return filtered;
    }
  };

  const handleSearch = () => {
    // The filtering will be handled by getFilteredPetitions()
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="text-blue-200 hover:text-white mb-2"
          >
            â Back to home
          </button>
          <h1 className="text-2xl font-bold">All Petitions</h1>
          <p className="text-blue-200">Browse and filter all available petitions</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search petitions</h2>
          <div className="flex max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for petitions..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              onClick={handleSearch}
              className="bg-emerald-600 text-white px-6 py-3 rounded-r-md hover:bg-emerald-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        petitions={petitions}
      />

      {/* Petitions List */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {activeFilter === 'all' ? 'All petitions' : `Filtered petitions (${activeFilter.replace('_', ' ')})`}
          </h2>
          {getFilteredPetitions().length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No petitions found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery.trim() 
                  ? `No petitions match your search "${searchQuery}"` 
                  : `There are currently no petitions in the "${activeFilter.replace('_', ' ')}" category.`
                }
              </p>
              <a 
                href="https://petition.parliament.uk/help#create-petition" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Learn how to create a petition
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {getFilteredPetitions().map((petition) => (
                <PetitionCard 
                  key={petition.id} 
                  petition={petition} 
                  onClick={onPetitionClick}
                  user={user}
                  onSign={onSign}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Search Component
export const SearchSection = ({ searchQuery, setSearchQuery, onSearch, onViewAllPetitions }) => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Search petitions</h2>
        <div className="flex max-w-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for petitions..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            onClick={onSearch}
            className="bg-emerald-600 text-white px-6 py-3 rounded-r-md hover:bg-emerald-700 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-6">
          <button
            onClick={onViewAllPetitions}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            <span>View all petitions</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Petition Card Component
export const PetitionCard = ({ petition, onClick, user, onSign }) => {
  const getStatusBadge = () => {
    if (petition.signatures >= 20) {
      return (
        <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>20+ signatures - Debate scheduled</span>
        </div>
      );
    } else if (petition.signatures >= 10) {
      return (
        <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
          <CheckCircle className="w-4 h-4" />
          <span>10+ signatures - Response required</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <h3 
            className="text-lg font-semibold text-blue-600 cursor-pointer hover:underline"
            onClick={() => onClick(petition)}
          >
            {petition.title}
          </h3>
          <p className="text-gray-600 mt-2 line-clamp-2">{petition.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{petition.signatures.toLocaleString()} signatures</span>
            <span className="text-sm text-gray-500">in the last hour</span>
          </div>
          {getStatusBadge()}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Created: {new Date(petition.created).toLocaleDateString()}
          </div>
          
          {petition.status === 'open' && (
            <button
              onClick={() => onSign(petition)}
              disabled={!user?.canSign}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                user?.canSign 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {user ? (user.canSign ? 'Sign Petition' : 'Rank 10+ Required') : 'Connect ROBLOX to Sign'}
            </button>
          )}
        </div>

        {petition.governmentResponse && (
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm text-blue-800">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Government response available
            </p>
          </div>
        )}

        {petition.debate?.status === 'completed' && (
          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <p className="text-sm text-green-800">
              <Calendar className="w-4 h-4 inline mr-1" />
              Debated in Parliament on {new Date(petition.debate.date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Petition Detail Component
export const PetitionDetail = ({ petition, onBack, user, onSign }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="text-blue-200 hover:text-white mb-2"
          >
            â Back to petitions
          </button>
          <p className="text-blue-200">This petition was submitted during the 2019-2024 parliament</p>
          <p className="text-blue-200">
            <a 
              href="https://petition.parliament.uk/archived/petitions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white underline"
            >
              View other petitions from this parliament
            </a>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500 uppercase tracking-wide">{petition.status === 'open' ? 'Open petition' : 'Rejected petition'}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{petition.title}</h1>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">{petition.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Signatures</h3>
                <p className="text-2xl font-bold text-blue-600">{petition.signatures.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Created by</h3>
                <p className="text-gray-700">{petition.creator}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                <p className="text-gray-700">{petition.category}</p>
              </div>
            </div>
          </div>

          {petition.status === 'open' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3">Sign this petition</h3>
              {user?.canSign ? (
                <div>
                  <p className="text-blue-800 mb-4">You can sign this petition because you have rank {user.rank} in ROBLOX group 541807.</p>
                  <button
                    onClick={() => onSign(petition)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign this petition
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-blue-800 mb-4">
                    {user 
                      ? `You need rank 10 or higher in ROBLOX group 541807 to sign petitions. Your current rank: ${user.rank}`
                      : 'Connect your ROBLOX account to sign this petition. You must have rank 10 or higher in group 541807.'
                    }
                  </p>
                  {!user && (
                    <button className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed">
                      Connect ROBLOX Account to Sign
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {petition.signatures >= 10 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">10 signatures</h3>
              </div>
              <p className="text-emerald-800">At 10 signatures, the government will respond to this petition</p>
            </div>
          )}

          {petition.signatures >= 20 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">20 signatures</h3>
              </div>
              <p className="text-emerald-800">At 20 signatures, this petition will be considered for debate in Parliament</p>
            </div>
          )}

          {petition.governmentResponse && (
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                Government response
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                The Government responded to this petition on {new Date(petition.governmentResponse.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{petition.governmentResponse.text}</p>
            </div>
          )}

          {petition.debate && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Parliamentary debate
              </h3>
              {petition.debate.status === 'completed' ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    This topic was debated on {new Date(petition.debate.date).toLocaleDateString()}
                  </p>
                  {petition.debate.videoUrl && (
                    <div className="space-y-2">
                      <a 
                        href={petition.debate.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Watch the debate on parliamentlive.tv</span>
                      </a>
                      <a 
                        href="https://hansard.parliament.uk/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline cursor-pointer block"
                      >
                        Read the transcript on parliament.uk
                      </a>
                      <a 
                        href="https://researchbriefings.files.parliament.uk/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline cursor-pointer block"
                      >
                        Read the research on parliament.uk
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  This petition is scheduled for debate on {new Date(petition.debate.date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Popular Petitions Component
export const PopularPetitions = ({ petitions, onPetitionClick, user, onSign }) => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular petitions</h2>
        {petitions.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No petitions found</h3>
            <p className="text-gray-600 mb-6">There are currently no petitions in the system.</p>
            <a 
              href="https://petition.parliament.uk/help#create-petition" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Learn how to create a petition
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {petitions.slice(0, 5).map((petition) => (
              <PetitionCard 
                key={petition.id} 
                petition={petition} 
                onClick={onPetitionClick}
                user={user}
                onSign={onSign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



// Start Petition Section
export const StartPetitionSection = ({ user }) => {
  return (
    <div className="bg-white py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Start a petition</h2>
        <p className="text-gray-600 mb-6">
          Anyone can start a petition as long as they are a British citizen or UK resident.
        </p>
        <button 
          disabled={!user?.canSign}
          className={`px-6 py-3 rounded font-medium transition-colors ${
            user?.canSign 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Start a petition
        </button>
        {!user?.canSign && (
          <p className="text-sm text-gray-500 mt-2">
            {user ? 'Rank 10+ required in ROBLOX group 541807' : 'Connect ROBLOX account to start petitions'}
          </p>
        )}
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://petition.parliament.uk/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="https://petition.parliament.uk/petitions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  All petitions
                </a>
              </li>
              <li>
                <a 
                  href="https://petition.parliament.uk/petitions/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Start a petition
                </a>
              </li>
              <li>
                <a 
                  href="https://petition.parliament.uk/help" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  How petitions work
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Crown Copyright</h3>
            <div className="flex items-center space-x-4">
              <img src="https://images.unsplash.com/photo-1720247521777-b2a1773ef020" alt="Parliament" className="w-12 h-8 object-cover rounded" />
              <img src="https://images.pexels.com/photos/418285/pexels-photo-418285.jpeg" alt="Crown" className="w-12 h-8 object-cover rounded" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Â© Crown copyright
            </p>
            <a 
              href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
            >
              Learn more about Crown Copyright
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ROBLOX Authentication Hook
export const useRobloxAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ROBLOX OAuth configuration
  const authUrl = 'https://apis.roblox.com/oauth/v1/authorize';
  const tokenUrl = 'https://apis.roblox.com/oauth/v1/token';
  const userInfoUrl = 'https://apis.roblox.com/oauth/v1/userinfo';
  const groupUrl = 'https://groups.roblox.com/v1/groups/541807/users';
  
  const clientId = process.env.REACT_APP_ROBLOX_CLIENT_ID;
  
  // Dynamic redirect URI based on environment
  const getRedirectUri = () => {
    const origin = window.location.origin;
    // For development/preview environments
    if (origin.includes('localhost') || origin.includes('preview.emergentagent.com')) {
      return `${origin}/oauth/callback`;
    }
    // For production - replace with your actual domain
    return 'https://your-production-domain.com/oauth/callback';
  };
  
  const redirectUri = getRedirectUri();
  const scope = 'openid profile group:read';

  // Generate state for security
  const generateState = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // Store state in sessionStorage
  const getStoredState = () => sessionStorage.getItem('roblox_oauth_state');
  const setStoredState = (state) => sessionStorage.setItem('roblox_oauth_state', state);

  // Check if we have a stored access token
  useEffect(() => {
    const storedUser = localStorage.getItem('roblox_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        localStorage.removeItem('roblox_user');
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = getStoredState();
    const isCallbackPath = window.location.pathname === '/oauth/callback' || window.location.search.includes('code=');

    if (code && state && state === storedState && isCallbackPath) {
      // Clear the URL parameters and redirect to home
      window.history.replaceState({}, document.title, '/');
      sessionStorage.removeItem('roblox_oauth_state');
      
      // Exchange code for token
      exchangeCodeForToken(code);
    }
  }, []);

  const login = async () => {
    setLoading(true);
    setError(null);

    try {
      const state = generateState();
      setStoredState(state);

      const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scope,
        state: state
      });

      // Redirect to ROBLOX OAuth
      window.location.href = `${authUrl}?${authParams.toString()}`;
    } catch (err) {
      setError('Failed to initiate ROBLOX authentication');
      setLoading(false);
    }
  };

  const exchangeCodeForToken = async (code) => {
    setLoading(true);
    
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: process.env.REACT_APP_ROBLOX_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Get user info
      const userResponse = await fetch(userInfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      
      // Get user's rank in group 541807
      const groupResponse = await fetch(`${groupUrl}/${userData.sub}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      let userRank = 0;
      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        userRank = groupData.role?.rank || 0;
      }

      const user = {
        id: userData.sub,
        username: userData.preferred_username || userData.name,
        rank: userRank,
        canSign: userRank >= 10,
        accessToken: accessToken
      };

      setUser(user);
      localStorage.setItem('roblox_user', JSON.stringify(user));
      
    } catch (err) {
      setError(`Failed to authenticate with ROBLOX: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('roblox_user');
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};
\ No newline at end of file