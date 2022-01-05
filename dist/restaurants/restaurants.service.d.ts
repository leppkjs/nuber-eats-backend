import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
export declare class RestaurantService {
    private readonly restaurants;
    constructor(restaurants: Repository<Restaurant>);
    getAll(): Promise<Restaurant[]>;
    createRestaurant(createRestaurantDto: CreateRestaurantDto): void;
    updateRestaurant({ id, data }: UpdateRestaurantDto): Promise<import("typeorm").UpdateResult>;
}
