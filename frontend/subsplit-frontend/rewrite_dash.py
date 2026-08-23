import sys

with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'r') as f:
    content = f.read()

# Add states
content = content.replace(
    '  const [renewalsOpen, setRenewalsOpen]',
    '  const [activePassesOpen, setActivePassesOpen] = useState(true);\n  const [requestsSentOpen, setRequestsSentOpen] = useState(true);\n  const [renewalsOpen, setRenewalsOpen]'
)

# SECTION 1
s1_old = '''      <Box id="my-subscriptions">
        {/* Section header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>'''

s1_new = '''      <Paper elevation={0} id="my-subscriptions" sx={{ borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 5 }}>
        {/* Section header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2} onClick={() => setActivePassesOpen(o => !o)} sx={{ cursor: 'pointer', userSelect: 'none' }}>'''

content = content.replace(s1_old, s1_new)

s1_mid_old = '''              </Box>
            )}
          </Stack>
        </Stack>

        {/* Pass cards */}'''

s1_mid_new = '''              </Box>
            )}
          </Stack>
          <ChevronRight size={18} color="#9ca3af" style={{ transition: 'transform 0.25s ease', transform: activePassesOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </Stack>
        
        <Collapse in={activePassesOpen}>
        <Box px={2.5} pb={2.5} pt={0}>
        {/* Pass cards */}'''

content = content.replace(s1_mid_old, s1_mid_new)

s1_end_old = '''          </Stack>
        )}
      </Box>

      {/* ── Section 2: My Requests Sent ──────────────────────────────────────── */}'''

s1_end_new = '''          </Stack>
        )}
        </Box>
        </Collapse>
      </Paper>

      {/* ── Section 2: My Requests Sent ──────────────────────────────────────── */}'''

content = content.replace(s1_end_old, s1_end_new)


# SECTION 2
s2_old = '''      <Box ref={pendingSentRef} id="my-requests-sent">
        {/* Section header */}
        <Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>'''

s2_new = '''      <Paper elevation={0} ref={pendingSentRef} id="my-requests-sent" sx={{ borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 5 }}>
        {/* Section header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2} onClick={() => setRequestsSentOpen(o => !o)} sx={{ cursor: 'pointer', userSelect: 'none' }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>'''

content = content.replace(s2_old, s2_new)

s2_mid_old = '''            </Box>
          )}
        </Stack>

        {pendingRequests.length === 0 ? ('''

s2_mid_new = '''            </Box>
          )}
          </Stack>
          <ChevronRight size={18} color="#9ca3af" style={{ transition: 'transform 0.25s ease', transform: requestsSentOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </Stack>

        <Collapse in={requestsSentOpen}>
        <Box px={2.5} pb={2.5} pt={0}>
        {pendingRequests.length === 0 ? ('''

content = content.replace(s2_mid_old, s2_mid_new)


s2_end_old = '''          </Stack>
        )}
      </Box>

      {/* ── Upcoming Renewals (collapsed accordion) ──────────────────────────── */}'''

s2_end_new = '''          </Stack>
        )}
        </Box>
        </Collapse>
      </Paper>

      {/* ── Upcoming Renewals (collapsed accordion) ──────────────────────────── */}'''

content = content.replace(s2_end_old, s2_end_new)


# Inner backgrounds (replace #14161a with #111114 for inner cards only). 
# Luckily, the inner cards are defined with '#14161a' and border '1px solid rgba(255,255,255,0.08)'
# They appear in sections 1 and 2. We can safely replace them.
inner_c1 = "background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center'"
inner_c1_new = inner_c1.replace("'#14161a'", "'#111114'")
content = content.replace(inner_c1, inner_c1_new)

inner_c2 = "background: '#14161a',\n                    border: '1px solid rgba(255,255,255,0.08)',\n                    transition: 'border-color 0.2s ease',"
inner_c2_new = inner_c2.replace("'#14161a'", "'#111114'")
content = content.replace(inner_c2, inner_c2_new)

inner_c3 = "background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', borderLeft: `4px solid ${req.statusColor || '#6366f1'}`"
inner_c3_new = inner_c3.replace("'#14161a'", "'#111114'")
content = content.replace(inner_c3, inner_c3_new)

with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'w') as f:
    f.write(content)

