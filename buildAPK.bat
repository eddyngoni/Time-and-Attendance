@echo off
cls
color a

set ANDROID_HOME=C:\Program Files (x86)\Android\android-sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

ionic build android

pause