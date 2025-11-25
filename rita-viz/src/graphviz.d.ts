declare module 'graphviz' {
    export interface GraphVizGraph {
        setGraphVizPath(path: string): void;
        set(key: string, value: any): void;
        output(
            type: string,
            callback: (data: string) => void,
            errorCallback?: (
                code: number,
                stdout: string,
                stderr: string
            ) => void
        ): void;
        output(
            type: string,
            path: string,
            callback: (code: number, stdout: string, stderr: string) => void
        ): void;
    }

    export interface GraphViz {
        parse(dot: string, callback: (graph: GraphVizGraph) => void): void;
        digraph(name: string): GraphVizGraph;
    }

    const graphvizModule: {
        graphviz: GraphViz;
    };

    export default graphvizModule;
}
