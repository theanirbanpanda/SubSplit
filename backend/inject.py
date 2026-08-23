import os
filepath = '/Users/anirban/Downloads/Subsplit/backend/src/main/java/com/subsplit/marketplace/service/impl/MarketplaceServiceImpl.java'
with open(filepath, 'r') as f:
    content = f.read()

injection = '''
            try {
                java.io.PrintWriter pw = new java.io.PrintWriter(new java.io.FileWriter("backend_error_log.txt", true));
                e.printStackTrace(pw);
                pw.flush();
                pw.close();
            } catch (Exception ex) {}
'''

new_content = content.replace("log.error(", injection + "log.error(")

with open(filepath, 'w') as f:
    f.write(new_content)
print("Done")
