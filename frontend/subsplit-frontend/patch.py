import os

filepath = '/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/marketplace/components/ManageListingModal.jsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { updateListing, renewListing } from '../marketplaceSlice';",
    """import { updateListing, renewListing, fetchListingMembers } from '../marketplaceSlice';
import { useNavigate } from 'react-router-dom';
import RateMemberModal from './RateMemberModal';
import { useSelector } from 'react-redux';
import { Avatar, Tooltip } from '@mui/material';
import { MessageSquare, Star as StarIcon } from 'lucide-react';"""
)

# 2. State & Hooks
hook_injection = """
  const navigate = useNavigate();
  const { listingMembers, loading } = useSelector((state) => state.marketplace);
  
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (open && activeTab === 2 && listing) {
      dispatch(fetchListingMembers(listing.id));
    }
  }, [open, activeTab, listing, dispatch]);

  const handleOpenRateModal = (member) => {
    setSelectedMember(member);
    setRateModalOpen(true);
  };
"""
content = content.replace(
    'const [seatsSuccess, setSeatsSuccess] = useState(false);',
    'const [seatsSuccess, setSeatsSuccess] = useState(false);\n' + hook_injection
)

# 3. Tab Label
content = content.replace(
    '<Tab label="Renew Subscription" />',
    '<Tab label="Renew Subscription" />\n          <Tab label="Members" />'
)

# 4. Tab Content (activeTab === 2)
tab_content = """
        {activeTab === 2 && (
          <Box>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress sx={{ color: '#3b82f6' }} />
              </Box>
            ) : (!listingMembers || listingMembers.length === 0) ? (
              <Box sx={{ textAlign: 'center', p: 4, background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Users size={40} color="#64748b" style={{ marginBottom: 16 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>No Members Yet</Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: 300, mx: 'auto', mt: 1 }}>
                  When users join and purchase a seat in this group, they will appear here.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {listingMembers.map((member) => (
                  <Box key={member.membershipId} sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={member.profileImage} sx={{ width: 44, height: 44, background: '#3b82f6' }}>
                        {member.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{member.name}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                          Joined {new Date(member.joinedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Chat with Member">
                        <IconButton 
                          onClick={() => navigate('/app/messages')}
                          sx={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', '&:hover': { background: 'rgba(59,130,246,0.2)' } }}
                        >
                          <MessageSquare size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rate Member">
                        <IconButton 
                          onClick={() => handleOpenRateModal(member)}
                          sx={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', '&:hover': { background: 'rgba(245,158,11,0.2)' } }}
                        >
                          <StarIcon size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
"""
content = content.replace(
    '</DialogContent>',
    tab_content + '\n      </DialogContent>'
)

# 5. Add RateMemberModal before closing Dialog
modal_inject = """
      <RateMemberModal 
        open={rateModalOpen} 
        handleClose={() => setRateModalOpen(false)} 
        member={selectedMember} 
        listingId={listing.id} 
      />
    </Dialog>
"""
content = content.replace('</Dialog>', modal_inject)

with open(filepath, 'w') as f:
    f.write(content)
print('Updated ManageListingModal')
