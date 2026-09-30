'use client';

import { useRouter } from 'next/navigation';
import SearchDropdown from '@/components/SearchDropdown';
import WorkspaceTabs from '@/components/WorkspaceTabs';

export const dynamic = 'force-dynamic';

export default function EconomicCalendarPage() {
  const router = useRouter();

  const events = [
    {
      date: '2026-09-30',
      day: 'Today',
      items: [
        { time: '12:30 UTC', country: 'US', event: 'Core PCE Price Index MoM', actual: '0.2%', forecast: '0.2%', previous: '0.2%', impact: 'high', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'Pending Home Sales MoM', actual: '-1.5%', forecast: '0.5%', previous: '0.6%', impact: 'medium', currency: 'USD' },
        { time: '14:30 UTC', country: 'US', event: 'Fed Chair Powell Speaks', actual: '', forecast: '', previous: '', impact: 'high', currency: 'USD' },
        { time: '15:00 UTC', country: 'EU', event: 'ECB President Lagarde Speaks', actual: '', forecast: '', previous: '', impact: 'high', currency: 'EUR' },
      ],
    },
    {
      date: '2026-10-01',
      day: 'Tomorrow',
      items: [
        { time: '01:30 UTC', country: 'CN', event: 'Caixin Manufacturing PMI', actual: '', forecast: '50.2', previous: '50.4', impact: 'high', currency: 'CNY' },
        { time: '12:30 UTC', country: 'CA', event: 'GDP MoM', actual: '', forecast: '0.1%', previous: '0.0%', impact: 'high', currency: 'CAD' },
        { time: '13:45 UTC', country: 'US', event: 'S&P Global Manufacturing PMI', actual: '', forecast: '48.5', previous: '48.0', impact: 'medium', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'ISM Manufacturing PMI', actual: '', forecast: '47.5', previous: '46.8', impact: 'high', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'Construction Spending MoM', actual: '', forecast: '0.3%', previous: '0.1%', impact: 'medium', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'JOLTS Job Openings', actual: '', forecast: '7.65M', previous: '7.67M', impact: 'high', currency: 'USD' },
      ],
    },
    {
      date: '2026-10-02',
      day: 'Friday',
      items: [
        { time: '12:30 UTC', country: 'US', event: 'Nonfarm Payrolls', actual: '', forecast: '180K', previous: '142K', impact: 'high', currency: 'USD' },
        { time: '12:30 UTC', country: 'US', event: 'Unemployment Rate', actual: '', forecast: '4.2%', previous: '4.2%', impact: 'high', currency: 'USD' },
        { time: '12:30 UTC', country: 'US', event: 'Average Hourly Earnings YoY', actual: '', forecast: '3.8%', previous: '3.8%', impact: 'high', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'Factory Orders MoM', actual: '', forecast: '-0.5%', previous: '0.5%', impact: 'medium', currency: 'USD' },
      ],
    },
    {
      date: '2026-10-06',
      day: 'Monday',
      items: [
        { time: '12:30 UTC', country: 'US', event: 'Fed Governor Bowman Speaks', actual: '', forecast: '', previous: '', impact: 'medium', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'ISM Services PMI', actual: '', forecast: '51.5', previous: '51.5', impact: 'high', currency: 'USD' },
      ],
    },
    {
      date: '2026-10-07',
      day: 'Tuesday',
      items: [
        { time: '06:00 UTC', country: 'DE', event: 'Factory Orders MoM', actual: '', forecast: '-1.0%', previous: '2.9%', impact: 'medium', currency: 'EUR' },
        { time: '12:30 UTC', country: 'US', event: 'Trade Balance', actual: '', forecast: '-78.5B', previous: '-78.8B', impact: 'medium', currency: 'USD' },
        { time: '14:00 UTC', country: 'US', event: 'Fed Governor Waller Speaks', actual: '', forecast: '', previous: '', impact: 'high', currency: 'USD' },
      ],
    },
    {
      date: '2026-10-08',
      day: 'Wednesday',
      items: [
        { time: '12:30 UTC', country: 'US', event: 'CPI MoM', actual: '', forecast: '0.1%', previous: '0.2%', impact: 'high', currency: 'USD' },
        { time: '12:30 UTC', country: 'US', event: 'Core CPI YoY', actual: '', forecast: '3.2%', previous: '3.2%', impact: 'high', currency: 'USD' },
        { time: '18:00 UTC', country: 'US', event: 'FOMC Meeting Minutes', actual: '', forecast: '', previous: '', impact: 'high', currency: 'USD' },
      ],
    },
    {
      date: '2026-10-09',
      day: 'Thursday',
      items: [
        { time: '12:30 UTC', country: 'US', event: 'PPI MoM', actual: '', forecast: '0.1%', previous: '0.2%', impact: 'medium', currency: 'USD' },
        { time: '12:30 UTC', country: 'US', event: 'Initial Jobless Claims', actual: '', forecast: '225K', previous: '219K', impact: 'medium', currency: 'USD' },
        { time: '14:30 UTC', country: 'US', event: 'Fed Chair Powell Speaks', actual: '', forecast: '', previous: '', impact: 'high', currency: 'USD' },
      ],
    },
  ];

  const impactColors = {
    high: '#ef4444',
    medium: '#eab308',
    low: '#22c55e',
  };

  const impactLabels = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
  };

  return (
    <div className="workspace-page">
      <header className="dashboard-header">
        <div className="header-top">
          <div className="logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">◆</span>
            <span className="logo-text">PredictChain</span>
          </div>
          <SearchDropdown />
          <nav className="main-nav">
            <WorkspaceTabs />
          </nav>
        </div>
      </header>

      <main className="workspace-main">
        <div className="page-header">
          <h1 className="page-title">Economic Calendar</h1>
          <p className="page-subtitle">Upcoming macro events & market-moving catalysts</p>
        </div>

        <div className="calendar-filters">
          <div className="filter-group">
            <label>Impact</label>
            <div className="impact-filters">
              {['high', 'medium', 'low'].map((level) => (
                <label key={level} className="impact-filter">
                  <input type="checkbox" defaultChecked />
                  <span className="filter-dot" style={{ backgroundColor: impactColors[level] }} />
                  {impactLabels[level]}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>Currencies</label>
            <div className="currency-filters">
              {['USD', 'EUR', 'CNY', 'CAD', 'JPY', 'GBP', 'AUD'].map((curr) => (
                <label key={curr} className="currency-filter">
                  <input type="checkbox" defaultChecked />
                  {curr}
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>Timezone</label>
            <select className="calendar-select" defaultValue="UTC">
              <option value="UTC">UTC</option>
              <option value="EST">EST (New York)</option>
              <option value="PST">PST (Los Angeles)</option>
              <option value="CET">CET (Europe)</option>
              <option value="SGT">SGT (Singapore)</option>
            </select>
          </div>
        </div>

        <div className="calendar-container">
          {events.map((day, dayIndex) => (
            <div key={day.date} className="calendar-day">
              <div className="day-header">
                <span className="day-name">{day.day}</span>
                <span className="day-date">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                <span className="day-count">{day.items.length} events</span>
              </div>
              <div className="day-events">
                {day.items.map((event, eventIndex) => (
                  <div key={`${day.date}-${eventIndex}`} className={`event-row ${event.impact}`}>
                    <div className="event-time">
                      <span className="time-value">{event.time}</span>
                      <span className="event-impact" style={{ backgroundColor: impactColors[event.impact] }}>
                        {impactLabels[event.impact]}
                      </span>
                    </div>
                    <div className="event-info">
                      <span className="event-country">{event.country}</span>
                      <span className="event-currency">{event.currency}</span>
                      <h4 className="event-title">{event.event}</h4>
                    </div>
                    <div className="event-values">
                      {event.actual ? (
                        <span className="event-actual">Actual: {event.actual}</span>
                      ) : (
                        <span className="event-forecast">Forecast: {event.forecast}</span>
                      )}
                      <span className="event-previous">Prev: {event.previous}</span>
                    </div>
                    <div className="event-action">
                      <button className="event-btn">Track</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-legend">
          <h4>Impact Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: impactColors.high }} />
              <span>High Impact — Major market mover, expect volatility</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: impactColors.medium }} />
              <span>Medium Impact — Notable influence on related assets</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: impactColors.low }} />
              <span>Low Impact — Minor influence, typically for context</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}