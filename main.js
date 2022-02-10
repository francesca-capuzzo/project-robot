const roads = [
    "Alice's House-Bob's House", 
    "Alice's House-Cabin",
    "Alice's House-Post Office",
    "Bob's House-Town Hall",
    "Daria's House-Ernie's House",
    "Daria's House-Town Hall",
    "Ernie's House-Grete's House", 
    "Grete's House-Farm",
    "Grete's House-Shop", 
    "Marketplace-Farm",
    "Marketplace-Post Office", 
    "Marketplace-Shop",
    "Marketplace-Town Hall", 
    "Shop-Town Hall"
    ];


/**
 * It builds a graph from the roads array.
 * @param edges - an array of strings representing the edges of the graph.
 * @returns The graph is being returned as an object with the key being the city and the value being an
 * array of the cities that are connected to it.
 */
function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];
        }else {
            graph[from].push(to);
        }
    }
    for (const [from, to] of edges.map(r => r.split("-"))) {   //uses split to generate 2 arrays from a string, separated on the special char "-" --> to/from places
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}
const roadGraph = buildGraph(roads);


/**
 * It runs the robot.
 * @param state - The current state of the world.
 * @param robot - A function that takes a state and memory and returns an action.
 * @param memory - The memory of the robot.
 */
function runRobot(state, robot, memory){
    for(let turn = 0; ; turn++){
        if (state.parcels.length === 0) {
            console.log('Done in ${turn}, turns');
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log('Moved to ${action.direction}');
    }
}


/**
 * Given an array, return a random element from that array.
 * 1- Math.random() by itself return a number 0 - 1 not including 1.
 * 2- This number * array.length gives (rounded with Math.floor(), gives us an INDEX for the array)
 * @param array - the array you want to pick from
 * @returns The randomPick function returns the value of the array at the randomly selected index.
 */
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

/**
 * Given a state, return a random direction
 * @param state - the current state of the robot
 * @returns A random direction.
 */
function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
}

