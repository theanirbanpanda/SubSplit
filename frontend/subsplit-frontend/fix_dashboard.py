import re

with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'r') as f:
    content = f.read()

# Add states back
if 'const [activePassesOpen' not in content:
    content = content.replace('  const [renewalsOpen, setRenewalsOpen]', '  const [activePassesOpen, setActivePassesOpen] = useState(true);\n  const [requestsSentOpen, setRequestsSentOpen] = useState(true);\n  const [renewalsOpen, setRenewalsOpen]')

# Section 1 Replacement
s1_pattern = r'(<Box id="my-subscriptions">)\s*({\/\* Section header \*\/})\s*(<Stack direction="row" alignItems="center" justifyContent="space-between" mb={2\.5}>)'
s1_repl = r'''<Paper elevation={0} id="my-subscriptions" sx={{ borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2} onClick={() => setActivePassesOpen(o => !o)} sx={{ cursor: 'pointer', userSelect: 'none' }}>'''
content = re.sub(s1_pattern, s1_repl, content)

# Section 1 Chevron
s1_chev_pattern = r'(\s*</Stack>\s*)({\/\* Pass cards \*\/})'
s1_chev_repl = r'''
          <ChevronRight size={18} color="#9ca3af" style={{ transition: 'transform 0.25s ease', transform: activePassesOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </Stack>
        <Collapse in={activePassesOpen}>
          <Box px={2.5} pb={2.5} pt={0}>
        \2'''
content = re.sub(s1_chev_pattern, s1_chev_repl, content, count=1)

# Section 1 Closing
s1_close_pattern = r'(\s*</Stack>\s*)}?\s*</Box>\s*({\/\* ── Section 2: My Requests Sent)'
s1_close_repl = r'\1}\n          </Box>\n        </Collapse>\n      </Paper>\n\n      \2'
content = re.sub(s1_close_pattern, s1_close_repl, content)

# Section 2 Replacement
s2_pattern = r'(<Box ref={pendingSentRef} id="my-requests-sent">)\s*({\/\* Section header \*\/})\s*(<Stack direction="row" alignItems="center" spacing={1\.25} mb={2\.5}>)'
s2_repl = r'''<Paper elevation={0} ref={pendingSentRef} id="my-requests-sent" sx={{ borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2} onClick={() => setRequestsSentOpen(o => !o)} sx={{ cursor: 'pointer', userSelect: 'none' }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>'''
content = re.sub(s2_pattern, s2_repl, content)

# Section 2 Chevron
s2_chev_pattern = r'(\s*</Stack>\s*)({\/\* Pending Requests List \*\/}|{pendingRequests\.length === 0)'
s2_chev_repl = r'''\1
          <ChevronRight size={18} color="#9ca3af" style={{ transition: 'transform 0.25s ease', transform: requestsSentOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
        </Stack>
        <Collapse in={requestsSentOpen}>
          <Box px={2.5} pb={2.5} pt={0}>
        \2'''
content = re.sub(s2_chev_pattern, s2_chev_repl, content, count=1)

# Section 2 Closing
s2_close_pattern = r'(\s*</Stack>\s*)}?\s*</Box>\s*({\/\* ── Upcoming Renewals)'
s2_close_repl = r'\1}\n          </Box>\n        </Collapse>\n      </Paper>\n\n      \2'
content = re.sub(s2_close_pattern, s2_close_repl, content)

# Inner background colors inside Section 1 and 2
inner_pattern = r"background: '#14161a', border: '1px solid rgba\(255,255,255,0\.08\)', textAlign: 'center'"
content = re.sub(inner_pattern, r"background: '#111114', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center'", content)
inner_pattern2 = r"background: '#14161a', border: '1px solid rgba\(255,255,255,0\.08\)', transition"
content = re.sub(inner_pattern2, r"background: '#111114', border: '1px solid rgba(255,255,255,0.08)', transition", content)
inner_pattern3 = r"background: '#14161a', border: '1px solid rgba\(255,255,255,0\.08\)', borderLeft"
content = re.sub(inner_pattern3, r"background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderLeft", content)


with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'w') as f:
    f.write(content)

