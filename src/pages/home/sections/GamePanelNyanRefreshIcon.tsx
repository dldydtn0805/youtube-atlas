import nyancatRefreshUrl from './assets/nyancat-refresh.svg';
import './GamePanelNyanRefreshIcon.css';

export default function GamePanelNyanRefreshIcon() {
  return (
    <img
      alt=""
      className="nyan-refresh-icon"
      draggable={false}
      src={nyancatRefreshUrl}
    />
  );
}
