import os
import numpy as np
import  sounddevice as sd
import json
import os
from scipy.io.wavfile import write
import random

from Utils import utils
from MusicalNote import MusicalNote



RED = '\033[34m'
RESET_COLOR = '\033[0m'


# Load the frequencies
def load_json_notes():
    with open('./Notes/frequency-notes.json', 'r') as f:
        return json.loads(f.read())
    
# Load the frequencies
frequency_notes = load_json_notes()



def lookup_frequency(key: str):
    return frequency_notes[key]


def create_random_chord(min_notes = 3, max_notes = 5):
    n_notes = random.randint(int(min_notes), int(max_notes))
    selected_frequencies = random.sample(list(dict(frequency_notes.items())), n_notes) # Randomly select an n_notes frequencies from frequency_notes
    
    single_random_chord = []
    for freq in selected_frequencies:
        note = MusicalNote(lookup_frequency(freq), 1, 0.5).generate() # Generate a note
        single_random_chord.append(note) # Add the Note to a chord

    return single_random_chord

def initial_chords_population(population_size = 25):
    chords_population = [create_random_chord() for _ in range(population_size)]
    return chords_population


def chord_wave(chord):
    waveform = sum(chord)
    waveform /= len(chord)
    return waveform

# Generate waveform for one progression
def progression_wave(progression, duration_per_chord=1.0, gap=0.1, sample_rate=44100):
    silence = np.zeros(int(sample_rate * gap))
    return np.concatenate([
        np.concatenate((chord_wave(chord), silence))
        for chord in progression
    ])


def fitness(genomes_and_fitness_values, threshold=3): # Higher fitness for better individual
    high_rated = [(rating, chord) for rating, chord in genomes_and_fitness_values if rating > threshold]
    return high_rated


def play_progressions(progressions, duration_per_chord=2.0, gap_between_chords=0.03, gap_between_progressions=0.1, sample_rate=44100):
    silence_between_progressions = np.zeros(int(sample_rate * gap_between_progressions))
    song = np.concatenate([
        np.concatenate((progression_wave(prog, duration_per_chord, gap_between_chords, sample_rate), silence_between_progressions))
        for prog in progressions
    ])

    


def train(generations):
    chords_population = initial_chords_population(10)
    genomes_and_fitness_values = []
    
    
    for gen in range(generations):
        print(f"\033[34mNow Using Generation {gen}----------------------------------------------------------------\033[0m")
        for chord in chords_population:
            silence = np.zeros(int(44100 * 0.001))
            
            if len(chord) > 0:
                harmonic_progression_1 = np.concatenate(
                    [np.concatenate((note, silence))
                    for note in chord]
                )
           
            else:
                print(f"Chord has zero-dimension")
            
            
            sd.play(harmonic_progression_1)
            sd.wait()
            
            rating = input("\033[33mRating The Sound You have Just listened To (0-5): \033[0m")
            
            try:
                rating = int(rating)
                
                if rating > 5:
                    rating = 5
                if rating < 0:
                    rating = 0
            except ValueError:
                rating = 0
            
            
            genomes_and_fitness_values.append((rating, chord))
            higly_rated = fitness(genomes_and_fitness_values)
                    
        
        sorted_genomes_by_fitness_score = sorted(higly_rated, key=lambda x: x[0], reverse=True) # Sorted in Desc by fitness score
        
        # Select Only genomes from sorted_genomes
        sorted_genomes = [genome_score_pair[1] for genome_score_pair in sorted_genomes_by_fitness_score]
        next_gen_genome_length = int(len(sorted_genomes) / 2)
        
        next_generation = sorted_genomes[0:2] # Elitism ==> A small number of the best-performing individuals (according to fitness) are copied directly to the next generation without modification.
            
        
        # Perform Single-point cross-over
        child_1, child_2 = utils.chord_crossover(next_generation[0], next_generation[1])
        child_3, child_4 = utils.chord_crossover(next_generation[2], next_generation[3])

        
        child_1_mutated = utils.mutate_chord(child_1, frequency_notes, mutation_rate=0.2)
        child_2_mutated = utils.mutate_chord(child_2, frequency_notes, mutation_rate=0.2)
        child_3_mutated = utils.mutate_chord(child_3, frequency_notes, mutation_rate=0.2)
        child_4_mutated = utils.mutate_chord(child_4, frequency_notes, mutation_rate=0.2)
        
        print(f"{RED}Child_1 Mutated: {child_1_mutated}{RESET_COLOR}")
        print(f"{RED}Child_2 Mutated: {child_2_mutated}{RESET_COLOR}")
        print(f"{RED}Child_3 Mutated: {child_3_mutated}{RESET_COLOR}")
        print(f"{RED}Child_4 Mutated: {child_4_mutated}{RESET_COLOR}")
        # child_4_mutated child_3_mutated
        next_generation += [child_1_mutated, child_2_mutated]
        chords_population = next_generation
    
    return chords_population





def main():

    chords_progression = train(5)
    print(f"This is the chords progression: {chords_progression}")
    sd.play(progression_wave(chords_progression))
    # play_progressions(chords_progression)
    print(f"\033[32mNow playing your chord progression\033[0m")
    sd.wait()
    


if __name__ == "__main__":
    main()