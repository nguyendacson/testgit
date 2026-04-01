
using Microsoft.AspNetCore.Localization;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddLocalization(options =>
{
    options.ResourcesPath = "";
});

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddViewLocalization()
    .AddDataAnnotationsLocalization();

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "vi", "en", "ja" };
    options.SetDefaultCulture("vi")
           .AddSupportedCultures(supportedCultures)
           .AddSupportedUICultures(supportedCultures);

    options.RequestCultureProviders = new List<IRequestCultureProvider>
{
    new CookieRequestCultureProvider(),
    new QueryStringRequestCultureProvider()
    // ← Bỏ AcceptLanguageHeader - nó đọc ngôn ngữ trình duyệt tiếng Anh
};
});

builder.Services.AddHttpClient();
var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRequestLocalization(); // ← phải sau middleware trên

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseRouting();
app.Run();
