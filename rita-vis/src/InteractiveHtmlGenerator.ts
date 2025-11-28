import { GraphData } from './GraphGenerator';

export function generateInteractiveHtml(data: GraphData): string {
    const dataJson = JSON.stringify(data);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RITA Interactive Visualization</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style type="text/css">
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #f0f0f0;
        }
        #mynetwork {
            width: 100%;
            height: 100%;
            border: 1px solid lightgray;
        }
        .controls {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 100;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="controls">
        <button onclick="network.fit()">Fit Graph</button>
    </div>
    <div id="mynetwork"></div>
    <script type="text/javascript">
        // create an array with nodes
        var rawData = ${dataJson};
        
        var nodes = new vis.DataSet(rawData.nodes);

        // create an array with edges
        var edges = new vis.DataSet(rawData.edges);

        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        var options = {
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 100,
                    nodeSpacing: 150
                }
            },
            physics: {
                hierarchicalRepulsion: {
                    nodeDistance: 150
                }
            },
            nodes: {
                shape: 'box',
                margin: 10,
                font: {
                    size: 16,
                    face: 'Arial'
                }
            },
            groups: {
                rule: {
                    color: '#e0e0ff',
                    shape: 'box'
                },
                operator: {
                    color: { background: '#ffcccc', border: '#ff0000' },
                    shape: 'circle'
                },
                atom: {
                    color: '#ffffff',
                    shape: 'ellipse'
                },
                comparison: {
                    color: '#eeeeee'
                },
                quantifier: {
                    color: '#ffddee'
                },
                literal: {
                    color: '#f0f0f0',
                    shape: 'text'
                }
            }
        };
        var network = new vis.Network(container, data, options);
    </script>
</body>
</html>`;
}
