#! /bin/bash
cd www/holoread-go
tar -xzvf app.tar.gz
pwd
supervisorctl restart holoread
