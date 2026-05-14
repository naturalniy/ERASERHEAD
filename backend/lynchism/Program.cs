using lynchism;
using lynchism.Models;
using lynchism.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();





builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true, 
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "������ JWT �����"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<String>()
        }
    });
});

// ����������� ��������� �� (SQLite)
builder.Services.AddDbContext<MyDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 45)));
});

builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.SetIsOriginAllowed(origin => true) // Разрешает ЛЮБОЙ домен
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
});

static List<ProductSize> GetDefaultSizes()
{
    return new List<ProductSize>
    {
        new ProductSize { Size = "S", Quantity = 10 },
        new ProductSize { Size = "M", Quantity = 15 },
        new ProductSize { Size = "L", Quantity = 10 }
    };
}

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var _context = services.GetRequiredService<MyDbContext>(); // Замени на имя своего контекста

    // 2. Проверяем, пустая ли база (чтобы не дублировать товары при каждом запуске)
    if (!_context.Products.Any())
    {
        var opiumDrop = new List<Product>
        {
            // --- BATCH 1: ARCHITECTURAL SERIES ---
            new Product { Name = "VANDAL STACKED DENIM", Description = "Engineered multi-fold silhouette in heavy 14oz denim with raw-edge finishing.", Price = 4800, Category = "Pants", ImageURL = "https://i.ibb.co/8grP9pfd/photo-35-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "GRID OVERLOCK TROUSERS", Description = "Technical slim-fit denim featuring contrast overlock stitching and mesh-lined ventilation.", Price = 4200, Category = "Pants", ImageURL = "https://i.ibb.co/207dMQKZ/photo-36-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ACID-ETCHED BOXY JEANS", Description = "Custom-treated acid wash denim with a relaxed boxy cut and cropped raw hems.", Price = 3900, Category = "Pants", ImageURL = "https://i.ibb.co/XfwKHsyB/photo-37-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "OBSIDIAN LAYERED CARGO", Description = "Multi-paneled construction featuring exposed structural seams and a dual-layered hem.", Price = 5500, Category = "Pants", ImageURL = "https://i.ibb.co/f5bzLFT/photo-38-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 2: SIGNATURE DENIM ---
            new Product { Name = "SELVEDGE STACKED FLARE", Description = "Premium Japanese selvedge denim with an extra-long inseam for natural stacking.", Price = 4500, Category = "Pants", ImageURL = "https://i.ibb.co/0pBFkbnx/photo-39-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ABYSS MULTI-POCKET SYSTEM", Description = "Tactical utility trousers with reinforced cargo pockets and adjustable compression straps.", Price = 5200, Category = "Pants", ImageURL = "https://i.ibb.co/Q795GXm0/photo-41-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "GRAPHITE OXIDE FLARE", Description = "Metallic-finish denim treated with graphite-oxide for an industrial, high-sheen look.", Price = 4300, Category = "Pants", ImageURL = "https://i.ibb.co/kgCzs614/photo-40-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 3: TECHNICAL & HYBRID ---
            new Product { Name = "TITANIUM TECH-SHELL PANTS", Description = "Water-resistant technical fabric with articulated knee construction and concealed zippers.", Price = 7800, Category = "Pants", ImageURL = "https://i.ibb.co/6J0dMJK1/photo-43-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ONYX NYLON-PANELED DENIM", Description = "Hybrid construction merging heavy denim with matte nylon inserts and thermal lining.", Price = 6500, Category = "Pants", ImageURL = "https://i.ibb.co/3y5wFBrn/photo-44-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "PHANTOM MODULAR TROUSERS", Description = "Technical pants with laser-cut MOLLE webbing and detachable utility compartments.", Price = 5800, Category = "Pants", ImageURL = "https://i.ibb.co/cK0vNRxq/photo-45-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CINDER INSULATED CARGO", Description = "High-loft thermal trousers encased in ash-toned distressed cotton denim.", Price = 8200, Category = "Pants", ImageURL = "https://i.ibb.co/XfYWXzph/photo-46-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 4: INDUSTRIAL SERIES ---
            new Product { Name = "WEB-LINK UTILITY DENIM", Description = "Heavy-duty trousers featuring integrated military webbing and brushed steel hardware.", Price = 4800, Category = "Pants", ImageURL = "https://i.ibb.co/WJhsM5J/photo-47-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VOID MAGNETIC BAGGY", Description = "Exaggerated baggy fit with integrated magnetic buckle systems and waterproof zippers.", Price = 5400, Category = "Pants", ImageURL = "https://i.ibb.co/TDLHQkqG/photo-48-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "HARDWARE-ACCENTED FLARE", Description = "Clean-cut flared denim with custom chrome hardware closures at the outer seams.", Price = 4500, Category = "Pants", ImageURL = "https://i.ibb.co/MxXH21HM/photo-49-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "OXIDIZED CHAIN TROUSERS", Description = "Treated black denim with removable heavy-gauge oxidized steel chain details.", Price = 4900, Category = "Pants", ImageURL = "https://i.ibb.co/zVqxSWh7/photo-50-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 5: DISTRESSED ESSENTIALS ---
            new Product { Name = "STATIC PRINT DENIM", Description = "Signature digital noise graphic on premium 14.5oz black denim.", Price = 4750, Category = "Pants", ImageURL = "https://i.ibb.co/bghXCs1Y/photo-2-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "INTARSIA KNIT DENIM", Description = "Experimental hybrid jeans with knitted texture panels and a distorted geometric pattern.", Price = 5500, Category = "Pants", ImageURL = "https://i.ibb.co/BKZ9PvhK/photo-3-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ECHO SHREDDED JEANS", Description = "Hand-distressed denim with subtle bleach treatment and multi-layered shredding.", Price = 4600, Category = "Pants", ImageURL = "https://i.ibb.co/Kj0tN72K/photo-4-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 6: FINISHED WASH ---
            new Product { Name = "INDUSTRIAL PATINA FLARE", Description = "Artisan-washed denim with a unique rust-inspired patina and straight-flare cut.", Price = 4100, Category = "Pants", ImageURL = "https://i.ibb.co/q3HVNF0g/photo-5-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VOID SPLATTER BAGGY", Description = "Oversized silhouette with a custom high-contrast bleach splatter finish.", Price = 3900, Category = "Pants", ImageURL = "https://i.ibb.co/8nDxFbYQ/photo-6-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "STRUCTURAL WIDE-LEG", Description = "Heavy architectural denim designed for a dramatic, static wide-leg profile.", Price = 4900, Category = "Pants", ImageURL = "https://i.ibb.co/tTQpqv9T/photo-7-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CARBON WEAVE DENIM", Description = "Technically woven denim mimicking carbon-fiber texture with a matte resin coating.", Price = 4400, Category = "Pants", ImageURL = "https://i.ibb.co/N2jsgcRb/photo-8-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 7: AVANT-GARDE SERIES ---
            new Product { Name = "ASH SEMI-SHEER PANTS", Description = "Technical semi-transparent fabric combined with cotton twill and bungee adjustments.", Price = 5100, Category = "Pants", ImageURL = "https://i.ibb.co/PGFpDCXb/photo-10-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VORTEX EMBROIDERED JEANS", Description = "Straight-leg denim with intricate 360-degree tonal vortex embroidery.", Price = 5200, Category = "Pants", ImageURL = "https://i.ibb.co/9HSJ9p1f/photo-11-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CHROME-TRIM BIKER DENIM", Description = "Reinforced biker construction with padded panels and silver-tone hardware accents.", Price = 6400, Category = "Pants", ImageURL = "https://i.ibb.co/ymsYt85K/photo-12-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "WAXED COTTON MAC-PANTS", Description = "Traditional tailoring meets avant-garde with heavy waxed cotton and oversized utility pockets.", Price = 5900, Category = "Pants", ImageURL = "https://i.ibb.co/ZpCWzBW6/photo-13-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 8: HYBRID TEXTURES ---
            new Product { Name = "STATIC KNIT TROUSERS", Description = "Hybrid denim featuring knitted elements and an integrated static-noise weave.", Price = 4100, Category = "Pants", ImageURL = "https://i.ibb.co/TMvpQJjq/photo-14-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "TITANIUM BUCKLE SLIM", Description = "Precision-tapered denim featuring a signature titanium-finish hardware closure.", Price = 4650, Category = "Pants", ImageURL = "https://i.ibb.co/1tZ2W1v5/photo-15-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "GHOST EMBROIDERED JEANS", Description = "Lightly distressed denim with tonal 'Ghost' embroidery and adjustable ankle straps.", Price = 4350, Category = "Pants", ImageURL = "https://i.ibb.co/CpXJZXHF/photo-16-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "MATTE OBSIDIAN TROUSERS", Description = "Premium leather-textured denim with a minimalist, clean-cut aesthetic and hidden seams.", Price = 6200, Category = "Pants", ImageURL = "https://i.ibb.co/GrvbbhY/photo-17-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 9: FUTURISTIC CUTS ---
            new Product { Name = "IRIDESCENT NEON FLARE", Description = "Reactive-dyed denim with iridescent oil-slick effects and a razor-sharp flare.", Price = 4950, Category = "Pants", ImageURL = "https://i.ibb.co/JRcmT9T5/photo-18-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "TECH-MESH CARGO SYSTEM", Description = "Breathable tech-mesh panels integrated into a heavy denim tactical frame.", Price = 4300, Category = "Pants", ImageURL = "https://i.ibb.co/sd306nhW/photo-21-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VANDAL GRAFFITI BAGGY", Description = "High-volume streetwear denim with custom archival graffiti prints.", Price = 4850, Category = "Pants", ImageURL = "https://i.ibb.co/kV8x1Jmv/photo-22-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- BATCH 10: FINAL SELECTION ---
            new Product { Name = "STERLING CHAIN FLARE", Description = "Elevated flared denim with integrated high-gauge sterling chains.", Price = 5600, Category = "Pants", ImageURL = "https://i.ibb.co/WWZtCP1N/photo-24-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "MIDNIGHT RAW FLARE", Description = "Classic deep-navy denim with an extreme flare and unrefined, raw-cut hems.", Price = 4200, Category = "Pants", ImageURL = "https://i.ibb.co/BVCwGPw2/photo-25-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "RAW CARBON ARCHITECT", Description = "Architectural matte-finish denim with maximum stiffness to maintain volume.", Price = 4700, Category = "Pants", ImageURL = "https://i.ibb.co/CswGDVxP/photo-26-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "PHANTOM STITCHED HYBRID", Description = "Wind-resistant technical denim with tonal structural stitching throughout.", Price = 5900, Category = "Pants", ImageURL = "https://i.ibb.co/svyrM21S/photo-27-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "OBSIDIAN FIELD PANTS", Description = "Tactical heavy-weight field pants with multi-compartment discrete storage.", Price = 5800, Category = "Pants", ImageURL = "https://i.ibb.co/svtpP1jg/photo-28-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "GLITCH PATTERNED CARGO", Description = "All-over digital glitch printed denim with a relaxed tapered fit.", Price = 6500, Category = "Pants", ImageURL = "https://i.ibb.co/cXTPpMMc/photo-29-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "HARDWARE BIKER STACKS", Description = "Extreme stacked silhouette with heavy padding and industrial metallic details.", Price = 9500, Category = "Pants", ImageURL = "https://i.ibb.co/v4TtBnmf/photo-30-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VOID WALKER TRANSIT PANTS", Description = "Technical denim designed for high-mobility with adjustable webbing systems.", Price = 4200, Category = "Pants", ImageURL = "https://i.ibb.co/WNz11p88/photo-31-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "SHADOW WASHED WIDE-LEG", Description = "Deeply faded obsidian denim with an ultra-wide silhouette and raw edges.", Price = 4450, Category = "Pants", ImageURL = "https://i.ibb.co/fzmJ87jb/photo-33-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CYBER TAPERED DENIM", Description = "Minimalist tapered denim featuring subtle digital-inspired circuit embroidery.", Price = 3800, Category = "Pants", ImageURL = "https://i.ibb.co/PGrfmVnJ/photo-34-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() }


            new Product { Name = "CORE BALACLAVA", Description = "Distressed rib-knit balaclava with anatomical fit.", Price = 2500, Category = "Accessories", ImageURL = "https://i.ibb.co/fYkYD333/9630f3ef18c748afbad78b016a2b1aa1.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VOID MESH MASK", Description = "Breathable tech-mesh mask with adjustable elastic straps.", Price = 1800, Category = "Accessories", ImageURL = "https://i.ibb.co/Zz8jx15q/196588af89e848b398ec1a5d48dbd652.png", Sizes = GetDefaultSizes() },
            new Product { Name = "INDUSTRIAL UTILITY BELT", Description = "Heavy-duty nylon belt with quick-release metal buckle.", Price = 3200, Category = "Accessories", ImageURL = "https://i.ibb.co/rRnVcj69/564053ab132e408fb30dec20fa08bc34.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CHROME LINK CHAIN", Description = "Oxidized steel wallet chain with industrial carabiners.", Price = 2800, Category = "Accessories", ImageURL = "https://i.ibb.co/HTvhCQk4/b1e68e51456b484788f4ce44862aeb74.png", Sizes = GetDefaultSizes() },
            new Product { Name = "PHANTOM BEANIE", Description = "Double-layered heavy cotton beanie with raw edge detailing.", Price = 2200, Category = "Accessories", ImageURL = "https://i.ibb.co/9HyT6TFC/04fb3f458d97494a94731ed1c0fe7bd4.png", Sizes = GetDefaultSizes() },
            new Product { Name = "TACTICAL CHEST RIG", Description = "Modular chest storage system with waterproof zippers.", Price = 4500, Category = "Accessories", ImageURL = "https://i.ibb.co/0y7dDRH4/7e30f6b5bd2848098f38089ce8c7b2b2.png", Sizes = GetDefaultSizes() },
            new Product { Name = "OBSIDIAN CROSSBODY BAG", Description = "Compact technical bag in high-density ballistic nylon.", Price = 3900, Category = "Accessories", ImageURL = "https://i.ibb.co/bgw1576h/49afd33f38d4406e9ccb25a2f0869312.png", Sizes = GetDefaultSizes() },
            new Product { Name = "SILVER STUDDED BRACELET", Description = "Handcrafted leather band with polished steel studs.", Price = 1500, Category = "Accessories", ImageURL = "https://i.ibb.co/601kGGQ2/733d9760df8f49a3869daf54733fc039.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CARBON FIBER CARDHOLDER", Description = "Minimalist wallet with carbon fiber texture finish.", Price = 1900, Category = "Accessories", ImageURL = "https://i.ibb.co/1YMhyyLK/2414ebae0c954092b6ab8c8bc658b8ed.png", Sizes = GetDefaultSizes() },
            new Product { Name = "REINFORCED GLOVES", Description = "Tactical half-finger gloves with padded protection.", Price = 2600, Category = "Accessories", ImageURL = "https://i.ibb.co/Q72XYt3N/5700d587db67453290ad264c4ea8502e.png", Sizes = GetDefaultSizes() },
            new Product { Name = "OPTI-SHIELD EYEWEAR", Description = "Futuristic wrap-around eyewear with UV protection.", Price = 4200, Category = "Accessories", ImageURL = "https://i.ibb.co/Txthqfc0/photo-42-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- OUTERWEAR (Куртки) ---
            new Product { Name = "VORTEX PUFFER JACKET", Description = "High-loft insulated jacket with a distorted silhouette.", Price = 12500, Category = "Outerwear", ImageURL = "https://i.ibb.co/5W4q7K3X/36ff9f1537114911b73fee6e591fb165.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ONYX FIELD SHELL", Description = "Water-resistant technical shell with multiple utility pockets.", Price = 9800, Category = "Outerwear", ImageURL = "https://i.ibb.co/hFfBp217/40df02c736a8452b932423472b9a0a0e.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CINDER CROPPED BOMBER", Description = "Heavy canvas bomber with cropped fit and distressed finish.", Price = 8900, Category = "Outerwear", ImageURL = "https://i.ibb.co/pjtMcfR0/be0e19b299f647b4a0903d05f5ba1a05.png", Sizes = GetDefaultSizes() },
            new Product { Name = "TITANIUM PARKA", Description = "Longline protective parka with adjustable hood and thermal lining.", Price = 14500, Category = "Outerwear", ImageURL = "https://i.ibb.co/VY3qTL0H/c9956f9439624fadbf6a87b89ca791db.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VOID WAXED COAT", Description = "Minimalist coat in heavy waxed cotton for extreme durability.", Price = 11000, Category = "Outerwear", ImageURL = "https://i.ibb.co/tprfGdjR/d876aeee79ea4f3f82d7bf485e80e452.png", Sizes = GetDefaultSizes() },
            new Product { Name = "PHANTOM DOWN JACKET", Description = "Ultra-lightweight down jacket with seamless construction.", Price = 13200, Category = "Outerwear", ImageURL = "https://i.ibb.co/ksLvSvdQ/f7f59505312a4bbebfd9965bc47a657e.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ARCHITECT WIND BREAKER", Description = "Asymmetric windbreaker with laser-cut ventilation.", Price = 7500, Category = "Outerwear", ImageURL = "https://i.ibb.co/60wrkDpq/0d110b17ba2b405a9903951dc1482340.png", Sizes = GetDefaultSizes() },
            new Product { Name = "INDUSTRIAL BIKER JACKET", Description = "Reinforced panels and chrome hardware in a classic biker cut.", Price = 15800, Category = "Outerwear", ImageURL = "https://i.ibb.co/wrzMHs6X/1fa5dcfcbad24177bfd7ad9e50acc67d.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CARBON SHELL ANORAK", Description = "Technical anorak with large front kangaroo pocket and side zips.", Price = 8400, Category = "Outerwear", ImageURL = "https://i.ibb.co/Fkr23v90/5dcfa91259884cbd8245b6319102ccec.png", Sizes = GetDefaultSizes() },
            new Product { Name = "OBSIDIAN VEST", Description = "Modular tactical vest designed for layering over hoodies.", Price = 6200, Category = "Outerwear", ImageURL = "https://i.ibb.co/MzfTYFj/f98f6c640d4f48b5aa97060e6cd2b141.png", Sizes = GetDefaultSizes() },
            new Product { Name = "STATIC HOODED JACKET", Description = "Graphic print jacket with oversized hood and raw hems.", Price = 9200, Category = "Outerwear", ImageURL = "https://i.ibb.co/sdMgSpLM/photo-1-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CHROME TECH BLAZER", Description = "Hybrid formal blazer with technical fabric and metal closures.", Price = 10500, Category = "Outerwear", ImageURL = "https://i.ibb.co/6JbRPwPZ/photo-32-2026-03-24-16-48-12.png", Sizes = GetDefaultSizes() },
        
            // --- TOPS (Футболки) ---
            new Product { Name = "VANDAL OVERSIZED TEE", Description = "Heavyweight cotton tee with dropped shoulders and boxy fit.", Price = 3500, Category = "Tops", ImageURL = "https://i.ibb.co/N2mmLfT7/5930dee724f843f7adeda8a7d3fb1f7b.png", Sizes = GetDefaultSizes() },
            new Product { Name = "STATIC NOISE T-SHIRT", Description = "Digital glitch print on premium jersey cotton.", Price = 3800, Category = "Tops", ImageURL = "https://i.ibb.co/wNqZ4x5b/4287413cfe7a46ea92b36cfdabcf6c70.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VOID LOGO TEE", Description = "Minimalist tonal logo embroidery on a relaxed frame.", Price = 3200, Category = "Tops", ImageURL = "https://i.ibb.co/LDV6JZ2s/8060365c3bbc47ea8db1d6b1d73d7672.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ECHO DISTRESSED TOP", Description = "Hand-shredded edges and faded wash for a vintage look.", Price = 4200, Category = "Tops", ImageURL = "https://i.ibb.co/gsTH2Pz/45832184452041e099b6122c90b041a6.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ONYX LAYERED TEE", Description = "Double-layer construction with raw-cut longline hem.", Price = 4500, Category = "Tops", ImageURL = "https://i.ibb.co/5Xx2ftp2/dc805db8c2be4a0d947be00378f40c2f.png", Sizes = GetDefaultSizes() },
            new Product { Name = "PHANTOM MESH TOP", Description = "Semi-sheer tech mesh top designed for avant-garde layering.", Price = 3900, Category = "Tops", ImageURL = "https://i.ibb.co/QvywZm65/e7f2d26dac8b481f9b6951d13f2f30dc.png", Sizes = GetDefaultSizes() },
            new Product { Name = "ARCHITECT BOX TEE", Description = "Structured heavy jersey tee with architectural seam work.", Price = 3600, Category = "Tops", ImageURL = "https://i.ibb.co/hFHWQTNs/04fb3f458d97494a94731ed1c0fe7bd4.png", Sizes = GetDefaultSizes() },
            new Product { Name = "CINDER WASHED TEE", Description = "Acid-washed ash grey tee with a soft-touch finish.", Price = 3400, Category = "Tops", ImageURL = "https://i.ibb.co/Z6WL1pyF/14c12ac09c7f4e93a64a08260dae0f92.png", Sizes = GetDefaultSizes() },
            new Product { Name = "VORTEX GRAPHIC T-SHIRT", Description = "Center-chest vortex graphic print on black 240GSM cotton.", Price = 3800, Category = "Tops", ImageURL = "https://i.ibb.co/DfztG73D/728cfc6bcbaa41dcbde877ad4fdfdc35.png", Sizes = GetDefaultSizes() },
            new Product { Name = "INDUSTRIAL LOGO TOP", Description = "Bold industrial branding printed with reflective ink.", Price = 4000, Category = "Tops", ImageURL = "https://i.ibb.co/5WQxGDdM/02574a04a7f84c19ad7716d7de03e1e8.png", Sizes = GetDefaultSizes() }
                
        };
        // --- ФИНАЛЬНЫЙ ШАГ ---
        await _context.Products.AddRangeAsync(opiumDrop);
        await _context.SaveChangesAsync();
    }
}



        
app.UseSwagger();
app.UseSwaggerUI();
//app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
