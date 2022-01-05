import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
export declare class RestaurantResolver {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    restaurants(): Promise<Restaurant[]>;
    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<boolean>;
    updateRestaurant(updateRestaurantDto: UpdateRestaurantDto): Promise<boolean>;
}
