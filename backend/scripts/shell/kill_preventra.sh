#!/bin/sh

PROGRAM_NAME='PreVentra'

Cnt=`ps -ef|grep $PROGRAM_NAME|grep -v grep|wc -l`
PROCESSES=`ps -ef|grep $PROGRAM_NAME|grep -v grep|awk '{print $2}'`

echo "$PROCESSES"

if [ $Cnt -gt 0 ]
then
   kill -9 $PROCESSES
   echo "$PROGRAM_NAME (PID : $PROCESSES) has been stopped."
else
   echo "$PROGRAM_NAME is not running."
fi