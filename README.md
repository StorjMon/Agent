# StorjMon
StorjMon is an app that monitors all your storj.io nodes and servers. Find out more @ www.storjmon.com

# Install StorjMon Agent on Linux

wget https://github.com/StorjMon/Agent/releases/download/v1.0/storjmon-linux.zip

cd storjmon-linux

vim (or other editor) config.json # paste the server key generated in your storjmon.com account

npm install pm2 -g

pm2 start storjmon-agent.js --name storjmon

pm2 startup

That`s it! In a few moments data should show in your dashboard.



# Contact us
You can join our user community on Telegram @ https://t.me/joinchat/FVKyyg-ZNtUvlywAsc4KiA

