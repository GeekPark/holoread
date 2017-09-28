#! /bin/bash
cd www/holoread-tg-bot
tar -xzvf bot.tar.gz
pwd
supervisorctl restart holoreadtgbot
