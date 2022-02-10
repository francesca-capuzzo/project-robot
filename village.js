class VillageState{
    constructor(place, parcels){
        this.place = place;
        this.parcels = parcels;

        VillageState.random = function(parcelCount = 5) {
            let parcels = [];
            for(let i = 0; i < parcelCount; i++){
                let address = randomPick(Object.keys(roadGraph));
                let place;
                do {
                    place = randomPick(Object.keys(roadGraph));
                } while(place == address);
            } parcels.push({place, address});
        }
        return new VillageState("Post Office", parcels);
    };


   /**
    * Given a destination, return a new VillageState with the parcels moved to the destination
    * 1- first check the presence of a road going from current place to destination.
    * 2- if 1- is not present, returns the current state since there is no other move to make.
    * 3- creates a new state with destination = robot's new place. (MAP FUNCTION)
    * 4- creates a new set of parcels that are at the robot's current place and move with him.
    * 5- parcels need to be removed from the undelivered stack every time (FUNCTION FILTER)
    * 
    * @param destination - the place you want to move to
    * @returns A new VillageState object.
    */
    move(destination){
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return {place: destination, address: p.address};
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}