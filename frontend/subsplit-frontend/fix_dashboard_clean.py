import re

with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'r') as f:
    lines = f.readlines()

out_lines = []
in_section1 = False
in_section2 = False

for i, line in enumerate(lines):
    if 'const [renewalsOpen, setRenewalsOpen]' in line:
        out_lines.append('  const [activePassesOpen, setActivePassesOpen] = useState(true);\n')
        out_lines.append('  const [requestsSentOpen, setRequestsSentOpen] = useState(true);\n')
        out_lines.append(line)
        continue

    # Section 1 starts
    if '{/* ── Section 1: My Active Passes' in line:
        in_section1 = True
    
    if in_section1 and '<Box id="my-subscriptions">' in line:
        out_lines.append('''      <Paper elevation={0} id="my-subscriptions" sx={{ borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 5 }}>\n''')
        continue

    if in_section1 and '<Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>' in line:
        out_lines.append('''        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2} onClick={() => setActivePassesOpen(o => !o)} sx={{ cursor: 'pointer', userSelect: 'none' }}>\n''')
        continue
    
    if in_section1 and '          </Stack>' in line and lines[i+1].strip() == '</Stack>':
        out_lines.append(line)
        out_lines.append('''          <ChevronRight size={20} color="#9ca3af" style={{ transition: 'transform 0.25s ease', transform: activePassesOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />\n''')
        out_lines.append('''        </Stack>\n''')
        out_lines.append('''        <Collapse in={activePassesOpen}>\n''')
        out_lines.append('''        <Box px={2.5} pb={2.5} pt={0}>\n''')
        continue
    
    if in_section1 and line.strip() == '</Stack>' and lines[i-1].strip() == '</Stack>':
        # Skip the original closing stack because we added it above
        continue
    
    if in_section1 and line.strip() == '</Box>' and '{/* ── Section 2: My Requests Sent' in lines[i+2]:
        out_lines.append('        </Box>\n')
        out_lines.append('        </Collapse>\n')
        out_lines.append('      </Paper>\n')
        in_section1 = False
        continue

    # Section 2 starts
    if '{/* ── Section 2: My Requests Sent' in line:
        in_section2 = True

    if in_section2 and '<Box ref={pendingSentRef} id="my-requests-sent">' in line:
        out_lines.append('''      <Paper elevation={0} ref={pendingSentRef} id="my-requests-sent" sx={{ borderRadius: '18px', background: '#14161a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', mb: 5 }}>\n''')
        continue

    if in_section2 and '<Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>' in line:
        out_lines.append('''        <Stack direction="row" alignItems="center" justifyContent="space-between" px={2.5} py={2} onClick={() => setRequestsSentOpen(o => !o)} sx={{ cursor: 'pointer', userSelect: 'none' }}>\n''')
        out_lines.append('''          <Stack direction="row" alignItems="center" spacing={1.25}>\n''')
        continue

    if in_section2 and '          </Stack>' in line and lines[i+1].strip() == '</Stack>':
        out_lines.append(line)
        out_lines.append('''          <ChevronRight size={20} color="#9ca3af" style={{ transition: 'transform 0.25s ease', transform: requestsSentOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />\n''')
        out_lines.append('''        </Stack>\n''')
        out_lines.append('''        <Collapse in={requestsSentOpen}>\n''')
        out_lines.append('''        <Box px={2.5} pb={2.5} pt={0}>\n''')
        continue
    
    if in_section2 and line.strip() == '</Stack>' and lines[i-1].strip() == '</Stack>':
        continue
    
    if in_section2 and line.strip() == '</Box>' and '{/* ── Upcoming Renewals' in "".join(lines[i:i+4]):
        out_lines.append('        </Box>\n')
        out_lines.append('        </Collapse>\n')
        out_lines.append('      </Paper>\n')
        in_section2 = False
        continue

    # Replace inner background
    if (in_section1 or in_section2) and "background: '#14161a'" in line:
        line = line.replace("background: '#14161a'", "background: '#111114'")

    out_lines.append(line)


with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'w') as f:
    f.writelines(out_lines)

