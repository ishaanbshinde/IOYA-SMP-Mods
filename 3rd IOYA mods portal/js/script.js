
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // CONFIG
    // ============================================================

    const GITHUB_BASE =
        "https://raw.githubusercontent.com/ishaanbshinde/IOYA-SMP-Mods/main/mods/";

    const mods = [

        // PERFORMANCE
        { id: "badoptimizations", name: "Bad Optimizations", filename: "BadOptimizations-2.4.1-26.3-fabric.jar", category: "performance", description: "Fixes inefficient game code.", recommended: true },
        { id: "dynamicfps", name: "Dynamic FPS", filename: "dynamic-fps-3.11.10+minecraft-26.3.0-fabric.jar", category: "performance", description: "Reduces resource usage when Minecraft is inactive.", recommended: true },
        { id: "entityculling", name: "Entity Culling", filename: "entityculling-fabric-1.12.2-mc26.3.jar", category: "performance", description: "Stops rendering hidden entities.", recommended: true },
        { id: "ferritecore", name: "FerriteCore", filename: "ferritecore-9.0.0-fabric.jar", category: "performance", description: "Reduces memory usage.", recommended: true },
        { id: "immediatelyfast", name: "ImmediatelyFast", filename: "ImmediatelyFast-Fabric-1.17.1+26.3.jar", category: "performance", description: "Optimizes rendering.", recommended: true },
        { id: "krypton", name: "Krypton", filename: "krypton-0.3.2.jar", category: "performance", description: "Optimizes networking.", recommended: true },
        { id: "lithium", name: "Lithium", filename: "lithium-fabric-0.26.4+mc26.3.jar", category: "performance", description: "Improves game logic performance.", recommended: true },
        { id: "moreculling", name: "More Culling", filename: "moreculling-fabric-26.3-1.9.2.jar", category: "performance", description: "Avoids rendering unnecessary objects.", recommended: true },
        { id: "sodium", name: "Sodium", filename: "sodium-fabric-0.9.3+mc26.3.jar", category: "performance", description: "Major rendering optimization.", recommended: true },
        { id: "sodiumextra", name: "Sodium Extra", filename: "sodium-extra-fabric-0.9.6+mc26.3.jar", category: "performance", description: "Extra Sodium settings.", recommended: true },
        { id: "reesesoptions", name: "Reese's Sodium Options", filename: "reeses-sodium-options-fabric-2.2.6+26.3.jar", category: "performance", description: "Improves the Sodium video settings interface.", recommended: true },

        // VISUAL
        { id: "etf", name: "Entity Texture Features", filename: "entity_texture_features-7.2.7-26.3-fabric.jar", category: "visual", description: "Enhanced entity texture support.", recommended: true },
        { id: "skinlayers", name: "3D Skin Layers", filename: "skinlayers3d-fabric-1.11.4-mc26.3.jar", category: "visual", description: "Renders player skin layers in 3D.", recommended: false },

        // HUD
        { id: "appleskin", name: "AppleSkin", filename: "appleskin-fabric-mc26.3-3.0.10.jar", category: "hud", description: "Food and saturation information.", recommended: true },
        { id: "armourdurability", name: "Armour Durability", filename: "armour-durability-1.11.26+mc26.3.jar", category: "hud", description: "Displays armour durability information.", recommended: true },
        { id: "bettermounthud", name: "Better Mount HUD", filename: "bettermounthud-1.3.1.jar", category: "hud", description: "Improved riding HUD.", recommended: false },
        { id: "chatheads", name: "Chat Heads", filename: "chat_heads-1.3.3-fabric-26.3.jar", category: "hud", description: "Player heads in chat.", recommended: true },

        // UTILITY
        { id: "clothconfig", name: "Cloth Config", filename: "cloth-config-fabric-26.3.161.jar", category: "utility", description: "Configuration library.", recommended: true },
        { id: "fabricapi", name: "Fabric API", filename: "fabric-api-0.166.2+26.3.jar", category: "utility", description: "Core Fabric modding API.", recommended: true },
        { id: "fabriclanguagekotlin", name: "Fabric Language Kotlin", filename: "fabric-language-kotlin-1.14.2+kotlin.2.4.21.jar", category: "utility", description: "Kotlin mod support.", recommended: true },
        { id: "jei", name: "JEI", filename: "jei-26.3-fabric-31.14.0.72.jar", category: "utility", description: "Item and recipe viewer.", recommended: true },
        { id: "mezzconfig", name: "Mezz Config", filename: "mezz_config-26.3-fabric-0.7.1.jar", category: "utility", description: "Configuration support.", recommended: false },
        { id: "modtogglemenu", name: "Mod Toggle Menu", filename: "mod-toggle-menu-mc26.3.jar", category: "utility", description: "Manage mod activation through a menu.", recommended: false },
        { id: "voicechat", name: "Simple Voice Chat", filename: "voicechat-fabric-2.6.27+26.3.jar", category: "utility", description: "Proximity voice chat.", recommended: false },
        { id: "yaclib", name: "YACL", filename: "yet_another_config_lib_v3-3.9.7+26.3-fabric.jar", category: "utility", description: "Configuration library.", recommended: true }

    ];

    // ============================================================
    // ELEMENTS
    // ============================================================

    const modGrid = document.getElementById("modGrid");
    const modSearch = document.getElementById("modSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");

    const selectedCount = document.getElementById("selectedCount");
    const downloadSummary = document.getElementById("downloadSummary");
    const libraryModCount = document.getElementById("libraryModCount");

    const selectRecommended = document.getElementById("selectRecommended");
    const selectAll = document.getElementById("selectAll");

    const clearSelection = document.getElementById("clearSelection");
    const downloadSelected = document.getElementById("downloadSelected");

    const installProgressContainer =
        document.getElementById("installProgressContainer");

    const installProgressBar =
        document.getElementById("installProgressBar");

    const installStatus =
        document.getElementById("installStatus");

    // ============================================================
    // STATE
    // ============================================================

    const selectedMods = new Set();

    let activeCategory = "all";
    let searchTerm = "";
    let buildingZIP = false;

    // ============================================================
    // HELPERS
    // ============================================================

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getModURL(mod) {
        return GITHUB_BASE + encodeURIComponent(mod.filename);
    }

    function getFilteredMods() {
        return mods.filter(mod => {
            const categoryMatch =
                activeCategory === "all" ||
                mod.category === activeCategory;

            const searchable =
                `${mod.name} ${mod.description} ${mod.filename} ${mod.category}`
                    .toLowerCase();

            return categoryMatch && searchable.includes(searchTerm);
        });
    }

    function setInstallStatus(message) {
        if (installStatus) {
            installStatus.textContent = message;
        }

        if (downloadSummary) {
            downloadSummary.textContent = message;
        }
    }

    function setProgress(percent) {
        const safePercent = Math.max(0, Math.min(100, percent));

        if (installProgressContainer) {
            installProgressContainer.style.display = "block";
        }

        if (installProgressBar) {
            installProgressBar.style.width = `${safePercent}%`;
        }
    }

    function resetProgress() {
        if (installProgressBar) {
            installProgressBar.style.width = "0%";
        }

        if (installProgressContainer) {
            installProgressContainer.style.display = "none";
        }
    }

    // ============================================================
    // UI UPDATE
    // ============================================================

    function updateSelectionUI() {
        const count = selectedMods.size;

        if (selectedCount) {
            selectedCount.textContent = count;
        }

        if (downloadSummary && !buildingZIP) {
            downloadSummary.textContent = count
                ? `${count} mods selected. Ready to build ZIP.`
                : "Select the mods you want to include.";
        }

        if (downloadSelected) {
            downloadSelected.disabled = count === 0 || buildingZIP;
        }

        if (libraryModCount) {
            libraryModCount.textContent = mods.length;
        }
    }

    // ============================================================
    // RENDER MODS
    // ============================================================

    function renderMods() {
        if (!modGrid) {
            console.error("IOYA: #modGrid not found.");
            return;
        }

        const filtered = getFilteredMods();

        if (!filtered.length) {
            modGrid.innerHTML = `
                <div class="no-mods">
                    <h3>No mods found</h3>
                    <p>Try another search.</p>
                </div>
            `;

            updateSelectionUI();
            return;
        }

        modGrid.innerHTML = filtered.map(mod => {
            const isSelected = selectedMods.has(mod.id);

            return `
                <article class="mod-card ${isSelected ? "selected" : ""}"
                    data-mod-id="${escapeHTML(mod.id)}">

                    <div class="mod-card-top">
                        <div>
                            <h3>${escapeHTML(mod.name)}</h3>

                            ${mod.recommended
                                ? '<span class="mod-badge">RECOMMENDED</span>'
                                : ""}
                        </div>

                        <span class="mod-category">
                            ${escapeHTML(mod.category)}
                        </span>
                    </div>

                    <p class="mod-description">
                        ${escapeHTML(mod.description)}
                    </p>

                    <div class="mod-card-bottom">
                        <label class="mod-toggle">
                            <input
                                type="checkbox"
                                data-id="${escapeHTML(mod.id)}"
                                ${isSelected ? "checked" : ""}
                            >

                            <span>
                                ${isSelected ? "Selected" : "Select"}
                            </span>
                        </label>
                    </div>

                </article>
            `;
        }).join("");

        modGrid.querySelectorAll(".mod-toggle input").forEach(box => {
            box.addEventListener("change", () => {
                const id = box.dataset.id;

                if (box.checked) {
                    selectedMods.add(id);
                } else {
                    selectedMods.delete(id);
                }

                renderMods();
            });
        });

        updateSelectionUI();
    }

    // ============================================================
    // SEARCH
    // ============================================================

    if (modSearch) {
        modSearch.addEventListener("input", () => {
            searchTerm = modSearch.value.trim().toLowerCase();
            renderMods();
        });
    }

    // ============================================================
    // FILTERS
    // ============================================================

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.category || "all";

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            renderMods();
        });
    });

    // ============================================================
    // SELECT RECOMMENDED
    // ============================================================

    if (selectRecommended) {
        selectRecommended.addEventListener("click", () => {
            mods.forEach(mod => {
                if (mod.recommended) {
                    selectedMods.add(mod.id);
                }
            });

            renderMods();
        });
    }

    // ============================================================
    // SELECT ALL
    // ============================================================

    if (selectAll) {
        selectAll.addEventListener("click", () => {
            mods.forEach(mod => selectedMods.add(mod.id));
            renderMods();
        });
    }

    // ============================================================
    // CLEAR SELECTION
    // ============================================================

    if (clearSelection) {
        clearSelection.addEventListener("click", () => {
            selectedMods.clear();
            renderMods();
        });
    }

    // ============================================================
    // ZIP MODPACK BUILDER
    // ============================================================

    async function buildModpackZIP() {
        const chosenMods = mods.filter(mod => selectedMods.has(mod.id));

        if (!chosenMods.length) {
            setInstallStatus("Select at least one mod.");
            return;
        }

        if (buildingZIP) return;

        if (typeof JSZip === "undefined") {
            setInstallStatus(
                "ZIP library unavailable. Check that JSZip is loaded in your HTML."
            );

            console.error("IOYA: JSZip is not loaded.");
            return;
        }

        buildingZIP = true;

        if (downloadSelected) {
            downloadSelected.disabled = true;
            downloadSelected.textContent = "Building ZIP...";
        }

        if (selectAll) selectAll.disabled = true;
        if (selectRecommended) selectRecommended.disabled = true;
        if (clearSelection) clearSelection.disabled = true;

        filterButtons.forEach(button => button.disabled = true);

        resetProgress();
        setProgress(0);

        const zip = new JSZip();
        const modsFolder = zip.folder("mods");

        const successful = [];
        const failed = [];

        try {

            // --------------------------------------------------------
            // FETCH MODS
            // --------------------------------------------------------

            for (let i = 0; i < chosenMods.length; i++) {
                const mod = chosenMods[i];

                setInstallStatus(
                    `Downloading ${i + 1}/${chosenMods.length}: ${mod.name}`
                );

                try {
                    const response = await fetch(getModURL(mod));

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const blob = await response.blob();

                    if (!blob.size) {
                        throw new Error("Downloaded file is empty.");
                    }

                    modsFolder.file(mod.filename, blob);

                    successful.push(mod.name);

                } catch (error) {
                    console.error(`Failed to download ${mod.name}:`, error);

                    failed.push({
                        name: mod.name,
                        error: error.message
                    });
                }

                setProgress(
                    Math.round(((i + 1) / chosenMods.length) * 70)
                );
            }

            // --------------------------------------------------------
            // STOP IF DOWNLOADS FAILED
            // --------------------------------------------------------

            if (failed.length > 0) {
                setInstallStatus(
                    `ZIP cancelled: ${successful.length} downloaded, ${failed.length} failed.`
                );

                let report =
                    `ZIP NOT CREATED.\n\n` +
                    `Successfully downloaded: ${successful.length}\n` +
                    `Failed: ${failed.length}\n\n` +
                    `Failed mods:\n`;

                failed.forEach(mod => {
                    report += `\n• ${mod.name}: ${mod.error}`;
                });

                alert(report);

                return;
            }

            // --------------------------------------------------------
            // GENERATE ZIP
            // --------------------------------------------------------

            setInstallStatus("All mods downloaded. Compressing ZIP...");
            setProgress(75);

            const zipBlob = await zip.generateAsync(
                {
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 6
                    }
                },
                metadata => {
                    setProgress(
                        75 + Math.round(metadata.percent * 0.25)
                    );
                }
            );

            // --------------------------------------------------------
            // DOWNLOAD ZIP
            // --------------------------------------------------------

            const downloadURL = URL.createObjectURL(zipBlob);
            const link = document.createElement("a");

            link.href = downloadURL;
            link.download = "IOYA-SMP-Modpack.zip";

            document.body.appendChild(link);
            link.click();
            link.remove();

            setProgress(100);

            setInstallStatus(
                `ZIP ready! ${successful.length} mods packed successfully.`
            );

            setTimeout(() => {
                URL.revokeObjectURL(downloadURL);
            }, 10000);

            alert(
                `Modpack created successfully!\n\n` +
                `${successful.length} mods included.\n\n` +
                `File: IOYA-SMP-Modpack.zip`
            );

        } catch (error) {
            console.error("IOYA ZIP BUILDER ERROR:", error);

            setInstallStatus(
                "ZIP creation failed. Check the console for details."
            );

            alert(
                "ZIP creation failed:\n" +
                error.message
            );

        } finally {
            buildingZIP = false;

            if (downloadSelected) {
                downloadSelected.textContent = "Build Modpack ZIP ↓";
                downloadSelected.disabled = selectedMods.size === 0;
            }

            if (selectAll) selectAll.disabled = false;
            if (selectRecommended) selectRecommended.disabled = false;
            if (clearSelection) clearSelection.disabled = false;

            filterButtons.forEach(button => button.disabled = false);

            updateSelectionUI();
        }
    }

    // ============================================================
    // BUTTON
    // ============================================================

    if (downloadSelected) {
        downloadSelected.textContent = "Build Modpack ZIP ↓";

        downloadSelected.addEventListener("click", buildModpackZIP);
    }

    // ============================================================
    // START
    // ============================================================

    resetProgress();
    renderMods();
    updateSelectionUI();

    console.log(`IOYA Modpack Builder loaded: ${mods.length} mods`);

});
