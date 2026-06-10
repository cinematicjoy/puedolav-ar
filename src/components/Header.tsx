import type { ThemeMode } from "../hooks/useThemeMode";

interface HeaderProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenCredits: () => void;
}

export function Header({ themeMode, onThemeChange, onOpenCredits }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">💧</div>
        <div>
          <h1>puedolav.ar</h1>
          <p>¿Conviene lavar hoy?</p>
        </div>
      </div>

      <div className="header-actions">
        <label className="theme-picker">
          <span className="sr-only">Modo visual</span>
          <select value={themeMode} onChange={(event) => onThemeChange(event.target.value as ThemeMode)} aria-label="Modo visual">
            <option value="system">Sistema</option>
            <option value="day">Día</option>
            <option value="night">Noche</option>
          </select>
        </label>
        <button className="ghost-button" type="button" onClick={onOpenCredits}>Créditos</button>
      </div>
    </header>
  );
}
