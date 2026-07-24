import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ProfileHeader from './components/ProfileHeader';
import VerificationCard from './components/VerificationCard';
import AboutCard from './components/AboutCard';
import SubscriptionOverview from './components/SubscriptionOverview';
import TrustScoreCard from './components/TrustScoreCard';
import AchievementCard from './components/AchievementCard';
import { EditProfileDialog, VerificationDialog } from './components/Dialogs';

function Profile() {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Anirban Das',
    location: 'Kolkata, India',
    bio: 'Hey! I love exploring new tools and digital services.\nI prefer premium experiences and believe in sharing and saving together with the community.',
    tags: ['Tech Enthusiast', 'Early Adopter', 'Productivity Lover'],
  });

  const handleSaveProfile = (newData) => {
    setProfileData({ ...profileData, ...newData });
  };

  return (
    <Box sx={{ color: '#f3f4f6', pb: 4 }}>
      {/* ─── Profile Header ─── */}
      <ProfileHeader onEditProfile={() => setEditProfileOpen(true)} />

      {/* ─── Verification & About Section ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <VerificationCard onViewDetails={() => setVerificationOpen(true)} />
        </Grid>
        <Grid item xs={12} md={7}>
          <AboutCard 
            bio={profileData.bio} 
            tags={profileData.tags} 
            onEdit={() => setEditProfileOpen(true)} 
          />
        </Grid>
      </Grid>

      {/* ─── Subscription Overview ─── */}
      <SubscriptionOverview />

      {/* ─── Trust Score & Achievements ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <TrustScoreCard />
        </Grid>
        <Grid item xs={12} md={7}>
          <AchievementCard />
        </Grid>
      </Grid>

      {/* ─── Dialogs ─── */}
      <EditProfileDialog 
        open={editProfileOpen} 
        onClose={() => setEditProfileOpen(false)} 
        data={profileData}
        onSave={handleSaveProfile}
      />

      <VerificationDialog 
        open={verificationOpen} 
        onClose={() => setVerificationOpen(false)} 
      />
    </Box>
  );
}

export default Profile;
