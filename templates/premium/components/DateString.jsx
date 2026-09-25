export default function DateString({ start, end }) {
  return <span>{start || 'N/A'} - {end || 'Present'}</span>;
}
