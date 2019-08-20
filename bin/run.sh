#!/bin/bash
export PATH=/export/local/node-v8.11.1/bin:/export/local/pm2-2.0.19/bin:$PATH
export PM2_HOME=/export/local/pm2-home-v1.0.0
export appName="fe_megrez_manual_check"

baseDir=`cd $(dirname $0);pwd`
logPath="/export/log/$appName"
logFile="$logPath/${appName}_detail.log"

cd "/export/wy/www/${appName}"

if [ ! -d "$logPath" ]; then
    #创建日志目录并授权
    mkdir -p "$logPath" && chmod -R 777 $logPath
fi

if [ ! $1 ]; then
    echo "ERROR! Please enter param: start or stop"
    echo "demo: sh ./bin/run.sh start"
else
    if [ $1 = "start" ]; then
        #echo "start"
        pm2 stop $appName
        pm2 delete $appName

        #单个文件可拆分大小
        pm2 set pm2-logrotate:max_size 50M
        #最多保留10个文件
        pm2 set pm2-logrotate:retain 10
        pm2 set pm2-logrotate:rotateModule true
        #最多每30分钟重命名一个文件，所以到分钟就可以了
        pm2 set pm2-logrotate:dateFormat 'YYYYMMDDHHmm'
        #每天0点执行
        pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
        #30分钟检查一次文件大小，如果文件已经大于10M，就按dataFormat格式重命名当前输出文件，并新建个输出文件
        pm2 set pm2-logrotate:workerInterval 1800

        NODE_ENV=beta pm2 start ${baseDir}/www --name "$appName" -l "$logFile" -o "/dev/null" -e "/dev/null" -i max --merge-logs
    elif [ $1 = "stop" ]; then
        #echo "stop"
        #注意：一个pm2不能部署多个应用。切记！切记！
        # kill $(ps aux | grep -i 'pm2' | grep -v grep | awk '{print $2}')
        pm2 stop $appName
        pm2 delete $appName
    else
        echo "ERROR! Please enter param: start or stop"
        echo "demo: sh ./bin/run.sh start"
    fi
fi
