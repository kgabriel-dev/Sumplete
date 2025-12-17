import random


def split_number(number: int, count: int, parts_input: list[int]) -> list[int]:
    placeholder = -1

    parts = []
    # collect all valid parts; break at the first placeholder
    for part in parts_input:
        if part != placeholder:
            parts.append(part)
        else:
            break

    remaining_number = number - sum(parts)
    remaining_count = count - len(parts)
    
    if remaining_count == 0 or remaining_number == 0:
        return parts

    # if only 1 more umber is needed, add the remaining number and return
    if remaining_count == 1:
        parts.append(remaining_number)
        return parts
    
    # calculate a new number
    # ensure at least 1 is left for each remaining part
    new_part = random.randint(1, remaining_number - (remaining_count - 1))
    parts.append(new_part)

    # fill in the parts list and fill placeholders
    parts_result = []
    for i in range(count):
        if i < len(parts):
            parts_result.append(parts[i])
        else:
            parts_result.append(placeholder)

    return split_number(number, count, parts_result)


def __main__():
    grid_size = 5
    grid: list[list[int]] = [[-1] * grid_size for _ in range(grid_size)]
    
    # Store the results for vertical and horizontal sums
    results = {
        "v": random.sample(range(grid_size + 4, grid_size * 3), grid_size),
        "h": [0] * grid_size
    }

    # Keep track of what numbers are correct and which are fillers
    correct_numbers = [[False] * grid_size for _ in range(grid_size)]

    for y in range(grid_size):
        # Solve the row
        row = split_number(results["v"][y], random.randint(1, grid_size), [])
        
        # Calculate the index for every number in the row
        random_indices = [j for j in range(grid_size)]
        random.shuffle(random_indices)

        for j in range(grid_size):
            index = random_indices[j]
            
            if j < len(row):
                grid[y][index] = row[j]
                correct_numbers[y][index] = True
            else:
                grid[y][index] = random.randint(1, results["v"][y])

    # Calculate the horizontal results based on the columns
    for x in range(grid_size):
        numbers = [grid[y][x] for y in range(grid_size) if correct_numbers[y][x]]

        results["h"][x] = sum(numbers)
    
    # Print the grid and results
    for y, row in enumerate(grid):
        print(results["v"][y], row)
    print(results["h"])

    print("\nVerification:\n")

    # Print correct numbers for verification
    for y, row in enumerate(grid):
        print(results["v"][y], [grid[y][x] if correct_numbers[y][x] else 0 for x in range(grid_size)])
    print(results["h"])

    # Check the solution
    for y in range(grid_size):
        row_result = results["v"][y]

        row_sum = sum(grid[y][x] for x in range(grid_size) if correct_numbers[y][x])
        assert row_sum == row_result, f"Row {y} sum {row_sum} does not match expected {row_result}"

    for x in range(grid_size):
        col_result = results["h"][x]

        col_sum = sum(grid[y][x] for y in range(grid_size) if correct_numbers[y][x])
        assert col_sum == col_result, f"Column {x} sum {col_sum} does not match expected {col_result}"


if __name__ == "__main__":
    __main__()