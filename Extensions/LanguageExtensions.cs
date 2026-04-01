using HRM.Enums;

namespace HRM.Extensions
{
    public static class LanguageExtensions
    {
        public static string GetDisplayName(this Language lang)
        {
            return lang switch
            {
                Language.Vietnamese => "Tiếng Việt",
                Language.English => "English",
                Language.Japanese => "日本語",
                _ => "Tiếng Việt"
            };
        }
        public static string GetCultureCode(this Language lang)
        {
            return lang switch
            {
                Language.Vietnamese => "vi",
                Language.Japanese => "ja",
                Language.English => "en",
                _ => "vi"
            };
        }

    }
}
