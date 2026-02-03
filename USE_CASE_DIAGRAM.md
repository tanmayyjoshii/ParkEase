# Parking Management System - Use Case Diagram

## Actors

1. **User** - Regular user who can book parking slots
2. **Admin** - Administrator with full system access
3. **IoT Device** - External IoT sensors/devices that send data
4. **System** - Automated system processes

## Use Cases

### Authentication Module
- **UC1: Register Account** - New users can create an account
- **UC2: Login** - Users authenticate to access the system

### Slot Management Module
- **UC3: View Available Slots** - View list of available parking slots (Public)
- **UC4: Book Parking Slot** - Reserve a parking slot for a specific date/time
- **UC5: Cancel Booking** - Cancel an existing booking
- **UC6: View My Bookings** - View all bookings made by the user
- **UC7: Generate QR Code** - Generate QR code for booking entry/exit
- **UC8: Scan QR Code** - Scan QR code for entry/exit validation

### Admin Functions Module
- **UC9: View All Bookings** - View all bookings across all users
- **UC10: Add Parking Slot** - Create new parking slots
- **UC11: Update Parking Slot** - Modify existing parking slot details
- **UC12: Delete Parking Slot** - Remove parking slots from system
- **UC13: View Reports & Analytics** - Access system statistics and reports

### IoT Management Module
- **UC14: Register IoT Device** - Add new IoT devices to the system
- **UC15: View IoT Devices** - List all registered IoT devices
- **UC16: Update IoT Device** - Modify IoT device configuration
- **UC17: Delete IoT Device** - Remove IoT devices from system
- **UC18: View Sensor Data** - View real-time and historical sensor data
- **UC19: Monitor Device Health** - Check health status of IoT devices
- **UC20: Control IoT Device** - Send control commands to devices
- **UC21: Restart Device** - Restart IoT devices remotely
- **UC22: Calibrate Device** - Calibrate sensor devices
- **UC23: View System Health** - Monitor overall system health
- **UC24: View Active Alerts** - View system alerts and notifications
- **UC25: Acknowledge Alert** - Mark alerts as acknowledged

### AI Analytics Module
- **UC26: Predict Parking Demand** - AI-powered demand forecasting
- **UC27: Detect Anomalies** - Identify unusual patterns in data
- **UC28: Optimize Slot Allocation** - AI-based slot optimization
- **UC29: Predict Maintenance Needs** - Predictive maintenance analytics
- **UC30: Generate Dynamic Pricing** - AI-driven pricing recommendations

### IoT Operations Module
- **UC31: Send Sensor Data** - IoT devices transmit sensor readings
- **UC32: Receive Commands** - IoT devices receive control commands

### System Operations Module
- **UC33: Process Sensor Data** - System processes incoming sensor data
- **UC34: Update Slot Availability** - Automatically update slot status
- **UC35: Generate Alerts** - System generates alerts based on conditions

## Use Case Relationships

### Actor-Use Case Relationships

**User** can perform:
- UC1, UC2, UC3, UC4, UC5, UC6, UC7, UC8

**Admin** can perform:
- All User use cases (UC1-UC8)
- UC9, UC10, UC11, UC12, UC13
- UC14, UC15, UC16, UC17, UC18, UC19, UC20, UC21, UC22, UC23, UC24, UC25
- UC26, UC27, UC28, UC29, UC30

**IoT Device** can perform:
- UC31 (Send Sensor Data)
- UC32 (Receive Commands)

**System** can perform:
- UC33 (Process Sensor Data)
- UC34 (Update Slot Availability)
- UC35 (Generate Alerts)

### Use Case Dependencies

- **UC31 → UC33**: IoT devices sending sensor data triggers system processing
- **UC33 → UC34**: Processing sensor data updates slot availability
- **UC33 → UC35**: Processing sensor data may generate alerts
- **UC20/UC21/UC22 → UC32**: Device control commands are received by IoT devices
- **UC18 → UC26/UC27**: Sensor data provides input for AI analytics
- **UC19 → UC29**: Device health data feeds into maintenance predictions

## Visual Representation

```
┌─────────────────────────────────────────────────────────────────┐
│              Parking Management System                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │   User       │───► Register, Login, View Slots,              │
│  └──────────────┘    Book Slot, View Bookings,                  │
│                      Generate/Scan QR Code                      │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   Admin      │───► All User functions +                      │
│  └──────────────┘    Manage Slots, View Reports,                │
│                      Manage IoT Devices,                         │
│                      AI Analytics, Alerts                        │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ IoT Device   │───► Send Sensor Data,                         │
│  └──────────────┘    Receive Commands                          │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   System     │───► Process Data, Update Slots,               │
│  └──────────────┘    Generate Alerts                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Notes

- **Public Access**: UC3 (View Available Slots) is accessible without authentication
- **Authentication Required**: All other user functions require login
- **Admin Only**: IoT management, AI analytics, and administrative functions are restricted to admin users
- **Automated Processes**: System operations (UC33-UC35) run automatically based on IoT data

