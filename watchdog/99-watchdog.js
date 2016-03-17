/**
* Created by Karl-Heinz Wind
**/

module.exports = function(RED) {
    "use strict";

    // --------------------------------------------------------------------------------------------
    // The watchdog node
    function WatchdogNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.timeout = config.timeoutseconds;
        
        this.pollInterval = 1 * 1000; // 1s
        this.lastUpdate = new Date().getTime();

        this.startTimer = function () {
            node.timer = setInterval(function () {
                var now = new Date().getTime();
                var elapsed = (now - node.lastUpdate) / 1000;
                if (elapsed > node.timeout) {
                    var msg = { payload: node.timeout };
                    node.send(msg);
                    node.stopTimer();
                    node.status({ fill: "red", shape: "dot", text: "timeout" });
                }                
            }, node.pollInterval);
            node.status({ fill: "green", shape: "dot", text: "armed" });
        }
        
        this.stopTimer = function () {
            if (node.timer) {
                clearTimeout(node.timer);
                node.timer = undefined;
                node.status({});
            }   
        }

        this.updateTimer = function () {
            if (node.timeout) {
                node.lastUpdate = new Date().getTime();

                if (this.timeout && !node.timer) {
                    node.startTimer();
                }
            }
        }
        
        this.on('input', function(msg) {
            node.updateTimer();
        });

        this.on('close', function (msg) {
        //    node.stopTimer();
        });
    }

    RED.nodes.registerType("watchdog", WatchdogNode);
}