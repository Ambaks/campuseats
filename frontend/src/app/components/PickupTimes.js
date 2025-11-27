import { useState } from "react";
import { TextField, Button, IconButton, Grid, Typography } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

export default function PickupTimes({ timeslots, setTimeslots }) {
  const [errors, setErrors] = useState([]);

  // Function to format date to HH:MM (24-hour format)
  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5); // Extract HH:MM
  };

  // Function to add a new time range with default values
  const handleAddTimeSlot = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Add 30 minutes

    const defaultStart = formatTime(new Date());
    const defaultEnd = formatTime(now);

    // Add the new time slot
    setTimeslots([...timeslots, { start: defaultStart, end: defaultEnd }]);
    setErrors([...errors, ""]);
  };

  // Function to validate 30-minute difference
  const isValidTimeRange = (start, end) => {
    if (!start || !end) return false;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const difference = (endTime - startTime) / (1000 * 60); // Convert to minutes
    return difference >= 30;
  };

  // Function to update a specific time range
  const handleTimeChange = (index, field, value) => {
    const updatedTimes = [...timeslots];
    updatedTimes[index][field] = value;

    // Validate time range when both start and end are set
    const { start, end } = updatedTimes[index];
    const updatedErrors = [...errors];

    if (field === "start" && end && !isValidTimeRange(value, end)) {
      updatedErrors[index] = "End time must be at least 30 mins after start time.";
    } else if (field === "end" && start && !isValidTimeRange(start, value)) {
      updatedErrors[index] = "End time must be at least 30 mins after start time.";
    } else {
      updatedErrors[index] = "";
    }

    setErrors(updatedErrors);
    setTimeslots(updatedTimes);
    console.log('Updated Timeslots:', updatedTimes);
  };

  // Function to remove a time slot
  const handleRemoveTimeSlot = (index) => {
    const updatedTimes = timeslots.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setTimeslots(updatedTimes);
    setErrors(updatedErrors);
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }} gutterBottom>
        Pickup Time Slots
      </Typography>
      {timeslots.map((slot, index) => (
        <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 1 }}>
          <Grid item xs={5}>
            <TextField
              type="time"
              fullWidth
              label="Start Time"
              value={slot.start}
              onChange={(e) => handleTimeChange(index, "start", e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors[index])}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              type="time"
              fullWidth
              label="End Time"
              value={slot.end}
              onChange={(e) => handleTimeChange(index, "end", e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors[index])}
              helperText={errors[index]}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton color="error" onClick={() => handleRemoveTimeSlot(index)}>
              <RemoveCircleIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
        Minimum timeslot is 30 minutes.
      </Typography>
      <Button variant="contained" onClick={handleAddTimeSlot} sx={{ mt: 1, backgroundColor: "#00A19D" }}>
        Add Time Slot
      </Button>
    </div>
  );
}
