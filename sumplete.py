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
    print(split_number(10, 3, []))


if __name__ == "__main__":
    __main__()