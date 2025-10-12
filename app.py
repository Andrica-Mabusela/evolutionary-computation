import os
import numpy as np
import  sounddevice as sd
import json
import os

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



# attack, decay, and release times will be specified in seconds, while the substain is defined as a ratio of the amplitude rather than an absolute value
# Third argument is sample_rate of standard 44100
def apply_envelope(sound: np.array, adsr: list, sample_rate: int = 44100) -> np.array: # adsr as a list of float values
    
    # Copy the sound to prevent modifying the original
    sound = sound.copy()
    
    # After copying, we need to calculate the number of samples needed for each stage of the ADSR envelope
    attack_samples = int(adsr[0] * sample_rate)
    decay_samples = int(adsr[1] * sample_rate)
    release_samples = int(adsr[3] * sample_rate)
    substain_samples = len(sound) - (attack_samples + decay_samples + release_samples)
    
    # Attack
    sound[:attack_samples] *= np.linspace(0, 1, attack_samples)
    
    # Decay
    sound[attack_samples:attack_samples + decay_samples] *= np.linspace(1, adsr[2], decay_samples)
    
    # Substain
    sound[attack_samples + decay_samples:attack_samples + decay_samples + substain_samples] *= adsr[2]
    
    # Release
    sound[attack_samples + decay_samples + substain_samples:] *= np.linspace(adsr[2], 0, release_samples)
    
    # Release the new sound array
    return sound


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


# --- Generate waveform for one progression ---
# def progression_wave(progression, duration_per_chord=1.0, gap=0.1, sample_rate=44100):
#     silence = np.zeros(int(sample_rate * gap))
#     return np.concatenate([
#         np.concatenate((chord_wave(chord, duration_per_chord, sample_rate), silence))
#         for chord in progression
#     ])


def main():
    
    chords_population = initial_chords_population(10)
    genomes_and_fitness_values = []
    generations = 5
    
    for gen in range(generations):
        print(f"\033[34mNow Using Generation {gen}----------------------------------------------------------------\033[0m")
        for chord in chords_population:
            silence = np.zeros(int(44100 * 0.001))
            
            # print(f"The population Shape is: {population.shape}")
            # print(f"The current Chord Shape is: {chord.shape}")
            print(f"The current silence Shape is: {silence.shape}")
            if len(chord) > 0:
                harmonic_progression_1 = np.concatenate(
                    [np.concatenate((note, silence))
                    for note in chord]
                )
                
                # for note in chord:
                #     print(f"The chord Length is: {len(chord)}")
                #     print(np.concatenate((note, silence)))             
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
        
        print("Finished printing ------------------------------------------------------------------")
            
        
        sorted_genomes_by_fitness_score = sorted(genomes_and_fitness_values, key=lambda x: x[0], reverse=True) # Sorted in Desc by fitness score
        
        # Select Only genomes from sorted_genomes
        sorted_genomes = [genome_score_pair[1] for genome_score_pair in sorted_genomes_by_fitness_score]
        next_gen_genome_length = int(len(sorted_genomes) / 2)
        
        next_generation = sorted_genomes[0:2] # Elitism ==> A small number of the best-performing individuals (according to fitness) are copied directly to the next generation without modification.
            
        
        # Perform Single-point cross-over
        child_1, child_2 = utils.chord_crossover(next_generation[0], next_generation[1])
        
        print(f"Child 1 is : {child_1}")
        print(f"Child 2 is : {child_2}")
        
        child_1_mutated = utils.mutate_chord(child_1, frequency_notes, mutation_rate=0.2)
        child_2_mutated = utils.mutate_chord(child_2, frequency_notes, mutation_rate=0.2)
        
        print(f"{RED}Child_1 Mutated: {child_1_mutated}{RESET_COLOR}")
        print(f"{RED}Child_2 Mutated: {child_2_mutated}{RESET_COLOR}")
        
        next_generation += [child_1_mutated, child_2_mutated]
        chords_population = next_generation

    print(f"\033[34mNow Let us move on to the next genearation {gen}----------------------------------------------------------------\033[0m")    
    # chords = initial_population_chords[0]
    # note_2 = initial_population_chords[0][1]
    # note_3 = initial_population_chords[0][2]
    
    # Generate 3 sine waves
    # note_1 = MusicalNote(783.99, 1, 0.5).generate()
    # note_2 = MusicalNote(293.66, 1, 0.5).generate()
    # note_3 = MusicalNote(698.46, 1, 0.5).generate()
    # note_4 = MusicalNote(440, 1, 0.5).generate()
    
    # print(f"Note is: {note_4}")
    # note_4 = MusicalNote(lookup_frequency(initial_population_chords[0][3]), 2, 0.5).generate()
    
    # my_sound = sum([note_1, note_2, note_3, note_4])
    # chords = [note_1, note_2, note_3]
    # my_sound = apply_envelope(my_sound, [0.5, 0.2, 0.6, 0.5])
    # silence = np.zeros(int(44100 * 0.01))
    # harmonic_progression_1 = np.concatenate(
    #     [np.concatenate((note, silence))
    #      for note in chords]
    # )
    
    # harmonic_progression_2 = np.concatenate(
    #     [np.concatenate((chord, silence))
    #      for chord in chords]
    # )
    # # Play Sound
    # sd.play(harmonic_progression_1)
    # sd.wait()
    # sd.play(harmonic_progression_2)
    # sd.wait()
    


if __name__ == "__main__":
    main()