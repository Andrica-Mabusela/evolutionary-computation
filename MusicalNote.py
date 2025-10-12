import numpy as np

class MusicalNote:

    def __init__(self, frequency: int = 440, duration: float = 1.0,
                 amplitude: float = 0.5, sample_rate: int = 44100):
        self.frequency = frequency
        self.duration = duration
        self.amplitude = amplitude
        self.sample_rate = sample_rate

    # Generate wave for one chord
    def generate(self) -> np.ndarray:
        # Number of samples required
        n_samples = int(self.sample_rate * self.duration)

        # Array of time points
        time_points = np.linspace(0, self.duration, n_samples, False)

        # Compute sine wave
        sine_wave = np.sin(2 * np.pi * self.frequency * time_points)

        # Apply amplitude
        sine_wave *= self.amplitude

        return sine_wave
