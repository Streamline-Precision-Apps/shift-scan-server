# Location Map Feature

A comprehensive real-time location mapping system that displays all users' current locations on an interactive map.

## Overview

The location map feature allows admins and managers to view:
- All active users' current locations
- Real-time location updates (auto-refreshes every 30 seconds)
- User names and precise coordinates
- Last update timestamps
- User location history (available through API)

## Architecture

### Backend

#### New Endpoint
- **GET `/api/v1/location/all`** - Fetches all users' latest locations
  - Requires authentication (`verifyToken` middleware)
  - Returns array of user locations with metadata

#### New Service Function
- **`fetchAllUsersLatestLocations()`** - Service function in `locationService.ts`
  - Iterates through all users in the database
  - Retrieves latest location for each user
  - Returns array with userId, userName, and location data
  - Handles errors gracefully

#### New Controller Function
- **`getAllUsersLocations()`** - Controller in `locationController.ts`
  - HTTP handler for the new endpoint
  - Calls `fetchAllUsersLatestLocations()`
  - Returns JSON response with all user locations

### Frontend

#### LocationMap Component
- **Location**: `/app/v1/components/LocationMap.tsx`
- **Libraries**: Leaflet for map rendering, OpenStreetMap tiles
- **Features**:
  - Displays interactive map centered on USA
  - Shows user markers with color-coded pins (blue)
  - Click markers to see user details in popup:
    - User name
    - Latitude/Longitude (4 decimal precision)
    - Last update time
  - Auto-refresh every 30 seconds
  - Manual refresh button
  - Loading states and error handling
  - Active user count display

#### Admin Page
- **Location**: `/app/admins/location-map/page.tsx`
- **Route**: `/admins/location-map`
- **Features**:
  - Server-side rendered with dynamic component loading
  - Prevents SSR issues with Leaflet
  - Loading screen while map initializes
  - Responsive design

## Usage

### Accessing the Map

1. Navigate to `/admins/location-map` in your browser
2. The map will load and display all active users
3. Click the "Refresh Now" button for immediate update
4. Map auto-updates every 30 seconds

### Map Interactions

- **Zoom**: Use scroll wheel or +/- buttons
- **Pan**: Click and drag to move around map
- **View User Details**: Click any marker to see user information
- **Close Popup**: Click the X or click elsewhere on map

## Data Flow

```
Users Clock In/Out
       ↓
Location saved to Firestore (userId/locations collection)
       ↓
Admin views /admins/location-map
       ↓
Frontend calls GET /api/v1/location/all
       ↓
Backend fetches all users' latest locations
       ↓
Frontend renders markers on map
       ↓
Auto-refresh every 30 seconds
```

## API Response Format

```json
[
  {
    "userId": "user123",
    "userName": "John Smith",
    "location": {
      "uid": "user123",
      "ts": "2025-11-05T17:30:00.000Z",
      "coords": {
        "lat": 40.7128,
        "lng": -74.0060,
        "accuracy": 15.5,
        "speed": 0,
        "heading": null
      },
      "device": {
        "platform": "ios"
      }
    }
  }
]
```

## Performance Considerations

### Location Updates
- Continuous background tracking provides regular updates
- Updates are throttled at 60-minute intervals during background tracking
- Foreground tracking updates continuously while shift is active

### Map Rendering
- Client-side rendering with Leaflet (lightweight)
- Auto-refresh interval: 30 seconds (configurable)
- Markers are updated in-place rather than recreated
- Old markers are removed when users go offline

### Database Queries
- One query per user to fetch latest location
- Uses Firestore ordering for efficiency
- Suitable for up to 1000+ active users

## Technologies Used

- **Leaflet**: Lightweight open-source map library
- **OpenStreetMap**: Free, open-source map tiles
- **Next.js Dynamic**: Server-side rendering optimization
- **React Hooks**: State management for map data

## Troubleshooting

### Map Not Loading
- Check browser console for errors
- Verify internet connection
- Clear browser cache and reload
- Check that location tracking is enabled for users

### No Users Showing
- Verify users have active location data
- Check that clock-in/clock-out has been performed
- Use the "Refresh Now" button to manually update
- Check backend API response: `GET /api/v1/location/all`

### Inaccurate Locations
- GPS accuracy depends on device and environment
- Accuracy value is displayed (in meters) in the data
- Indoor locations may have lower accuracy
- Wait for more location updates to improve accuracy

## Security

- All endpoints require authentication (`verifyToken`)
- Only authenticated admins/managers can access the map
- Location data is tied to individual user accounts
- Uses existing Firebase authentication

## Future Enhancements

- [ ] Filter users by job site/team
- [ ] Display location history trails
- [ ] Geofence alerts for jobsites
- [ ] Export location reports
- [ ] Custom time range filtering
- [ ] Heat maps for frequently visited areas
- [ ] Real-time socket updates (instead of polling)
- [ ] Mobile app integration

## Configuration

### Auto-Refresh Interval
To change the refresh rate, modify the interval in `LocationMap.tsx`:
```typescript
const interval = setInterval(fetchLocations, 30000); // 30 seconds
```

### Map Center and Zoom
To change the default map view, modify in `LocationMap.tsx`:
```typescript
map.current = L.map(mapContainer.current).setView([39.8283, -98.5795], 4);
// [lat, lng], zoom_level
```

### Marker Color
To change marker color, update the marker icon URL:
```typescript
// Current: blue
// Options: https://github.com/pointhi/leaflet-color-markers
// Change "marker-icon-2x-blue.png" to:
// - marker-icon-2x-red.png
// - marker-icon-2x-green.png
// - marker-icon-2x-yellow.png
```

## Files Modified

### Backend
- `server/src/services/locationService.ts` - Added `fetchAllUsersLatestLocations()`
- `server/src/controllers/locationController.ts` - Added `getAllUsersLocations()`
- `server/src/routes/locationRoutes.ts` - Added `/all` endpoint

### Frontend
- `client/app/v1/components/LocationMap.tsx` - New map component
- `client/app/admins/location-map/page.tsx` - New admin page
- `client/package.json` - Added leaflet and @types/leaflet

## Dependencies Added

```json
{
  "dependencies": {
    "leaflet": "^1.9.x"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.x"
  }
}
```

## Testing

### Manual Testing
1. Clock in multiple users from different locations (or simulate locations)
2. Navigate to `/admins/location-map`
3. Verify all users appear as markers
4. Click markers to verify details
5. Wait 30 seconds to verify auto-refresh
6. Test manual refresh button
7. Test zoom, pan, and popup interactions

### API Testing
```bash
# Test the endpoint directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/v1/location/all
```

## Support

For issues or questions about the location map feature:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check network requests in DevTools
4. Verify backend API is running and accessible
