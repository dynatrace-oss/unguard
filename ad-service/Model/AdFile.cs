using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace AdService.Model
{
    public class AdFile
    {
        public static string FileFolder = "adFolder";
        public string Name { get; set; }
        public DateTime CreationTime { get; set; }

        /// <summary>Creates a path with webRootPath and FileFolder and checks if it contains files.</summary>
        ///
        public static bool FolderIsEmpty(string webRootPath)
        {
            var filePath = Path.Combine(webRootPath, FileFolder);
            return Directory.GetFiles(filePath).Length == 0;
        }
        
        /// <summary>Create a list of current available files.</summary>
        ///
        public static List<AdFile> CreateList(string webRootPath)
        {
            var imageDirectory = Path.Combine(webRootPath, FileFolder);
            var filePaths = Directory.GetFiles(imageDirectory);

            return CreateList(filePaths);
        }

        /// <summary>Create a list of current available files.</summary>
        ///
        public static List<AdFile> CreateList(IEnumerable filePath)
        {
            return (
                from string file in filePath
                select new AdFile { Name = Path.GetFileName(file), CreationTime = File.GetCreationTime(file) }
            ).ToList();
        }
    }
}