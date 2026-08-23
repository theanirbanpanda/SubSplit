import re

with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'r') as f:
    content = f.read()

# Helper to wrap a section
def wrap_section(content, box_id, mb_val="5"):
    # Replace Box with Paper
    pattern_box = rf'<Box (ref={{[^}}]+}} )?id="{box_id}"( mb={{{mb_val}}})?>'
    replacement_box = rf'''<Paper
        elevation={{0}}
        \1id="{box_id}"
        sx={{{{
          borderRadius: '18px',
          background: '#14161a',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
          mb: {mb_val},
        }}}}
      >'''
    content = re.sub(pattern_box, replacement_box, content)
    
    # Replace Stack mb=2.5 with px=2.5 py=2
    # Be careful to target the specific stack right after the Paper
    pattern_stack = rf'(id="{box_id}"[\s\S]*?<Stack\s+direction="row"\s+alignItems="center"\s+justifyContent="space-between")\s+mb={{2\.5}}'
    replacement_stack = r'\1\n          px={2.5}\n          py={2}'
    content = re.sub(pattern_stack, replacement_stack, content)
    
    return content

content = wrap_section(content, "my-subscriptions")
content = wrap_section(content, "my-requests-sent")
content = wrap_section(content, "dashboard-renewals-accordion", "0")
content = wrap_section(content, "dashboard-activity-accordion")

# Also need to add Box px={2.5} pb={2.5} pt={0} inside Collapse for all sections.
# Active Passes
content = re.sub(r'(<Collapse in={activePassesOpen}>\s*)', r'\1<Box px={2.5} pb={2.5} pt={0}>\n        ', content)
content = re.sub(r'(\s*</Collapse>\s*</Paper>\s*{/\* ── Section 2)', r'\n        </Box>\1', content)

# Requests Sent
content = re.sub(r'(<Collapse in={requestsSentOpen}>\s*)', r'\1<Box px={2.5} pb={2.5} pt={0}>\n        ', content)
content = re.sub(r'(\s*</Collapse>\s*</Paper>\s*{/\* ── Section 3)', r'\n        </Box>\1', content)

# Upcoming Renewals
content = re.sub(r'(<Collapse in={renewalsOpen}>\s*)<Box>', r'\1<Box px={2.5} pb={2.5} pt={0}>', content)

# Recent Activity
content = re.sub(r'(<Collapse in={activityOpen}>\s*)<Box>', r'\1<Box px={2.5} pb={2.5} pt={0}>', content)

# Need to replace the closing </Box> of the outer wrapper with </Paper>
content = re.sub(r'(\s*</Collapse>\s*)</Box>', r'\1</Paper>', content)

# Now replace background: '#14161a' with background: '#111114' for inner cards inside Section 1 & 2
# We'll just replace '#14161a' with '#111114' for all Paper elevations that are inner.
# Let's target specific lines or just replace all inner papers.
inner_paper_pattern = r"background:\s*'#14161a',\s*border:\s*'1px solid rgba\(255,255,255,0\.08\)',\s*textAlign:\s*'center'"
content = re.sub(inner_paper_pattern, r"background: '#111114', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center'", content)

inner_paper_pattern2 = r"background:\s*'#14161a',\s*border:\s*'1px solid rgba\(255,255,255,0\.08\)',\s*transition"
content = re.sub(inner_paper_pattern2, r"background: '#111114', border: '1px solid rgba(255,255,255,0.08)', transition", content)

inner_paper_pattern3 = r"background:\s*'#14161a',\s*border:\s*'1px solid rgba\(255,255,255,0\.08\)',\s*borderLeft"
content = re.sub(inner_paper_pattern3, r"background: '#111114', border: '1px solid rgba(255,255,255,0.08)', borderLeft", content)

with open('/Users/anirban/Downloads/Subsplit/frontend/subsplit-frontend/src/features/dashboard/Dashboard.jsx', 'w') as f:
    f.write(content)

