import "./Control.css";

const LocationInput = ({
  location,
  setLocation
}: {
  location: string;
  setLocation: (location: string) => void;
}) => {
  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="location-input">
        Location
      </label>
      <input
        id="location-input"
        className="c-control__input"
        placeholder="Enter address, city, zip..."
        value={location}
        onChange={(e) => setLocation(e.target.value)} />
    </div>
  );
}

export default LocationInput;