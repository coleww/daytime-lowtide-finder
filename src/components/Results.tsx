import { type StationData, type DaytimeLowtideData } from '../types';
import './Results.css';
import Result from './Result';
import { formatDateTZ } from '../utils/parse';

type ResultsProps = {
  tideTarget: number;
  stationData?: StationData;
  daytimeLowtideDates: DaytimeLowtideData[];
  selectDate: (date: DaytimeLowtideData) => void;
  unselectDate: (date: DaytimeLowtideData) => void;
  selectedDates: DaytimeLowtideData[];
};

function Results({
  daytimeLowtideDates,
  stationData,
  tideTarget,
  unselectDate,
  selectDate,
  selectedDates,
}: ResultsProps) {
  if (!stationData) return <div className="loading">Loading . . .</div>;
  const { metadata, timezone } = stationData;
  const { title, lat, lng } = metadata;

  return (
    <div className="results">
      <div className="station-title">
        <div>
          {title} - {lat},{lng}
        </div>
        <div>{daytimeLowtideDates.length} results</div>
      </div>

      <div className="results-container">
        {daytimeLowtideDates.map(dtlt => {
          return (
            <Result
              key={formatDateTZ(dtlt.sunrise, timezone)}
              lowtideData={dtlt}
              timezone={timezone}
              tideTarget={tideTarget}
              selectDate={selectDate}
              unselectDate={unselectDate}
              selectedDates={selectedDates}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Results;
