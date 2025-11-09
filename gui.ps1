#!/usr/bin/env pwsh
# GUI Launcher para PowerShell - Y2Back
# Uso: gui --start | gui -s

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$guiScript = Join-Path $scriptDir "gui.js"

& node $guiScript @args