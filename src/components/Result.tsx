import { type LowtideEventData } from '../types';
import { formatDateTZ, formatTimeTZ } from '../utils/parse';
import './Result.css';
import { useMemo, type ReactNode, useCallback } from 'react';

type ResultProps = {
  lowtideData: LowtideEventData;
  timezone: string;
  tideTarget: number;
  selectDate: (date: LowtideEventData) => void;
  unselectDate: (date: LowtideEventData) => void;
  selectedDates: LowtideEventData[];
};

function Result({
  lowtideData,
  tideTarget,
  timezone,
  unselectDate,
  selectDate,
  selectedDates,
}: ResultProps) {
  const { sunrise, sunset, tides } = lowtideData;

  const date = formatDateTZ(sunrise, timezone);

  const isSelected = useMemo(() => {
    return Boolean(selectedDates.find(date => date.sunrise === sunrise));
  }, [selectedDates, sunrise]);

  const toggleCheckbox = useCallback(() => {
    isSelected ? unselectDate(lowtideData) : selectDate(lowtideData);
  }, [isSelected, lowtideData, selectDate, unselectDate]);

  const rows = useMemo(() => {
    const eventMap: { [key: string]: ReactNode } = {};
    eventMap[sunrise.getTime()] = (
      <tr key={sunrise.getTime()}>
        <td className="sunrise">sunrise</td>
        <td>{formatTimeTZ(sunrise, timezone)}</td>
      </tr>
    );
    eventMap[sunset.getTime()] = (
      <tr key={sunset.getTime()}>
        <td className="sunset">sunset</td>
        <td>{formatTimeTZ(sunset, timezone)}</td>
      </tr>
    );
    tides.forEach(tide => {
      const isLow = tide.tide < tideTarget;
      eventMap[tide.time.getTime()] = (
        <tr key={tide.time.getTime()}>
          <td className={isLow ? 'low-tide-result' : ''}>{tide.tide}ft</td>
          <td>{formatTimeTZ(tide.time, timezone)}</td>
        </tr>
      );
    });

    return Object.keys(eventMap)
      .sort()
      .map(ts => eventMap[ts]);
  }, [sunrise, sunset, tideTarget, tides, timezone]);

  return (
    <div
      className={`result ${isSelected ? 'selected' : ''}`}
      onClick={toggleCheckbox}
    >
      <div className="date">
        {date}{' '}
        <input type="checkbox" checked={isSelected} onChange={toggleCheckbox} />
      </div>
      <table className="result-table">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Result;
