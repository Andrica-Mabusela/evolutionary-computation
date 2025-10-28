import numpy as np
import sounddevice as sd
import random

# --- Piano keys (short version) ---
PIANO_KEYS = {
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23,
    "G4": 392.00, "A4": 440.00, "B4": 493.88, "C5": 523.25
}

# --- Create random chord ---
def create_random_chord(keys, min_notes=3, max_notes=5):
    n_notes = random.randint(min_notes, max_notes)
    return random.sample(list(keys.items()), n_notes)

# --- Create random harmonic progression ---
def create_progression(keys, num_chords=4):
    return [create_random_chord(keys) for _ in range(num_chords)]

# --- Generate waveform for one chord ---
def chord_wave(chord, duration=1.0, sample_rate=44100):
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    waveform = sum(np.sin(2 * np.pi * freq * t) for _, freq in chord)
    waveform /= len(chord)
    return waveform

# --- Generate waveform for one progression ---
def progression_wave(progression, duration_per_chord=1.0, gap=0.1, sample_rate=44100):
    silence = np.zeros(int(sample_rate * gap))
    return np.concatenate([
        np.concatenate((chord_wave(chord, duration_per_chord, sample_rate), silence))
        for chord in progression
    ])

# --- Play multiple progressions ---
def play_progressions(progressions, duration_per_chord=1.0, gap_between_chords=0.03, gap_between_progressions=0.1, sample_rate=44100):
    silence_between_progressions = np.zeros(int(sample_rate * gap_between_progressions))
    song = np.concatenate([
        np.concatenate((progression_wave(prog, duration_per_chord, gap_between_chords, sample_rate), silence_between_progressions))
        for prog in progressions
    ])
    
    print(f"Song Length is: {len(song)}")
    sd.play(song, sample_rate)
    sd.wait()

# --- Example usage ---
if __name__ == "__main__":
    # Create 3 random progressions
    progressions = [create_progression(PIANO_KEYS, num_chords=4) for _ in range(3)]

    # Print chord names for clarity
    for i, prog in enumerate(progressions):
        # print(f"Progression {i+1}: {[ [n for n, _ in chord] for chord in prog ]}")
        pass

    # Play them all
    play_progressions(progressions, duration_per_chord=1.0)
