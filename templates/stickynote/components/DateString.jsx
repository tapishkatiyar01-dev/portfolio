export default function DateString({ start, end }) {
  const format = (value) => {
    if (!value || value === 'Present') return value || '';
    const match = String(value).match(/^(\d{4})(?:-(\d{1,2}))?/);
    if (!match) return value;
    if (!match[2]) return match[1];
    return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(match[2]) - 1]} ${match[1]}`;
  };
  return <>{format(start)}{start || end ? ' — ' : ''}{format(end || 'Present')}</>;
}
