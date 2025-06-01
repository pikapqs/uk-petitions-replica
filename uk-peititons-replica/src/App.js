diff --git a/frontend/src/App.js b/frontend/src/App.js
index ba09c5f..d7ff252 100644
import React, { useState } from 'react';
 import "./App.css";
import { 
  Header, 
  StatsSection, 
  SearchSection, 
  PopularPetitions, 
  StartPetitionSection, 
  Footer, 
  PetitionDetail,
  AllPetitionsPage,
  mockPetitions,
  useRobloxAuth
} from './components';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ROBLOX Authentication
  const robloxAuth = useRobloxAuth();

  // Simple search functionality
  const getFilteredPetitions = () => {
    if (searchQuery.trim()) {
      return mockPetitions.filter(petition =>
        petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        petition.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        petition.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
     }
    return mockPetitions;
   };
 
  const handleSearch = () => {
    // The filtering will be handled by getFilteredPetitions()
  };
 
  const handleViewAllPetitions = () => {
    setCurrentPage('all-petitions');
  };

  const handlePetitionClick = (petition) => {
    setSelectedPetition(petition);
    setCurrentPage('petition-detail');
  };

  const handleSignPetition = async (petition) => {
    if (!robloxAuth.user?.canSign) {
      alert('You need rank 10 or higher in ROBLOX group 541807 to sign petitions.');
      return;
    }

    // Mock signing process
    const confirmed = window.confirm(`Do you want to sign the petition: "${petition.title}"?`);
    if (confirmed) {
      alert('Thank you for signing the petition!');
    }
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gray-50">
      <StatsSection />
      <SearchSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onViewAllPetitions={handleViewAllPetitions}
      />
      <PopularPetitions 
        petitions={getFilteredPetitions()}
        onPetitionClick={handlePetitionClick}
        user={robloxAuth.user}
        onSign={handleSignPetition}
      />
      <StartPetitionSection user={robloxAuth.user} />
     </div>
   );
 
  const renderAllPetitionsPage = () => (
    <AllPetitionsPage
      onBack={() => setCurrentPage('home')}
      petitions={mockPetitions}
      user={robloxAuth.user}
      onSign={handleSignPetition}
      onPetitionClick={handlePetitionClick}
    />
  );

  const renderPetitionDetail = () => (
    <PetitionDetail
      petition={selectedPetition}
      onBack={() => {
        setCurrentPage('home');
        setSelectedPetition(null);
      }}
      user={robloxAuth.user}
      onSign={handleSignPetition}
    />
  );

   return (
     <div className="App">
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={robloxAuth.user}
        robloxAuth={robloxAuth}
      />
      
      {robloxAuth.loading && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-700">Connecting to ROBLOX...</p>
          </div>
        </div>
      )}

      {robloxAuth.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{robloxAuth.error}</p>
        </div>
      )}

      <main>
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'all-petitions' && renderAllPetitionsPage()}
        {currentPage === 'petition-detail' && renderPetitionDetail()}
      </main>
      
      <Footer />
     </div>
   );
 }