package com.example.foodiesapi.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeliveryLocation {
    private String location;
    private Double lat;
    private Double lng;
    private Long updatedAt;
}
