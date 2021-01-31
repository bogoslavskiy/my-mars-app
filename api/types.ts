
export type Rover = {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
};

export type RoverCamera = {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
};

export type RoverPhoto = {
  id: number;
  sol: number;
  camera: RoverCamera;
  img_src: string;
  earth_date: string;
  rover: Rover;
};

export type RoverRequestResult = {
  photos: RoverPhoto[];
};