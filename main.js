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

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
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


/* This is a function that creates a new VillageState object with random parcels. */
VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for(let i = 0; i < parcelCount; i++){
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do { //do-while keeps picking new addresses until place != address as we dont want the any parcel sent from the address it's destinated to.
            place = randomPick(Object.keys(roadGraph));
        } while(place == address);
    } parcels.push({place, address});
}
return new VillageState("Post Office", parcels);


/**
 * Given a state and a memory, return a new state with the robot's direction and memory
 * @param state - The current state of the robot.
 * @param memory - the route that the robot is currently following.
 * @returns The direction and memory.
*/
function routeRobot(state, memory) {
    if (memory.length === 0) {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)}
}


/**
 * FindRoute(graph, from, to)
 * 1 - WORK: --> from: actual position, + route: empty route ---> work list --> array of places that should be explored next.
 * 2 - FIND ROUTE --> look for the next element on the list and explore all route going from there
 * 3 - If 2- find  a route that matches the goal, than that route is returned.
 * 4 - If 3- it's not the goal but we haven't looked at it before, gets added to the list of new items.
 * 5 - If 3- it's not the goal AND we have already looked at it before, it means it's a longer route (discard)
 * The function takes a graph and two nodes, and returns a list of nodes that represents the shortest
 * path between the two nodes
 * @param graph - A graph of places.
 * @param from - The starting point of the route.
 * @param to - The place you want to get to.
 * @returns An array of strings.
*/
function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];  
    for (let i = 0; i < work.length; i++) {
        let {at, route} = work[i];
        for (const place of graph[at]) {
            if (place === to) return route.concat(place);
            if (!work.some(w => w.at === place)) {
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}


function goalOrientedRobot({place, parcels}, route) {
    if (route.length === 0) {
        let parcel = parcels[0];
        if (parcel.place !== place) {
            route = findRoute(roadGraph, place, parcel.place);
        } else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return {direction: route[0], memory: route.slice(1)};
}