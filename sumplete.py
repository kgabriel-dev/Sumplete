import random


def split_number(number: int, count: int, parts: list[int]) -> list[int]:
    remaining_number = number - sum(parts)
    remaining_count = count - len(parts)
    
    if len(parts) == count or remaining_number == 0:
        return parts

    # if only 1 more umber is needed, add the remaining number and return
    if remaining_count == 1:
        parts.append(remaining_number)
        return parts
    
    # calculate a new number
    # ensure at least 1 is left for each remaining part
    new_part = random.randrange(1, 1 + remaining_number - (remaining_count - 1))
    parts.append(new_part)

    return split_number(number, count, parts)


def __main__():
    print(split_number(10, 3, []))


if __name__ == "__main__":
    __main__()