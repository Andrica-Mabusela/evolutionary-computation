import random

from MusicalNote import MusicalNote

def chord_crossover(parent1, parent2):
    
    length = min(len(parent1), len(parent2)) # Ensure both parents have the same number of notes
    
    point = random.randint(1, length - 1) # Choose crossover point
    
    # Combine parts from both parents
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    
    return child1, child2


def mutate_chord(chord, KEYS, mutation_rate=0.2):
    new_chord = chord.copy()
    notes = list(KEYS.values())
    # print(f"The Notes to select from: {notes}")
    for i in range(len(new_chord)):
        if random.random() < mutation_rate: # controlled mutation
            # Replace this note with a random note
            randomly_selected_freq = random.choice(notes)
            musical_note = MusicalNote(randomly_selected_freq, 1, 0.5).generate()
            new_chord[i] = musical_note
            
    print(f"The mutated Chord is: {new_chord}")
    return new_chord