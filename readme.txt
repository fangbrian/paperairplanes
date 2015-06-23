APPPP


Setup

Each server needs to be set up accordingly, based on what type of server it is. These are the steps to initally set up a server:

view/download the corresponding example startup.sh script
scp the startup.sh script to your server's home directory
ssh into your server
make the script executable: 'chmod 755 startup.sh'
move the startup.sh script to /usr/bin: 'mv startup.sh /usr/bin'
setup rc.local file:
'cd /etc/init.d'
'sudo vim rc.local' -- whatever is contained in 'rc.local' will run as ROOT on startup
at the end of this file, add the line: 'yes | startup.sh' -- this will tell the server to run startup.sh and answer 'yes' to all confirmations
reboot your server and check if the release engine is running. you can do 'ps -ef' to check all running processes.
