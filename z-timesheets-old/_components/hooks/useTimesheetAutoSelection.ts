import { useEffect, useRef, useMemo } from 'react';

interface AutoSelectionOptions {
  id: string;
  name: string;
}

interface CostCodeOption {
  value: string;
  label: string;
}

interface Equipment {
  id: string;
  name: string;
}

interface TascoLog {
  shiftType: string;
  materialType: string;
  laborType?: string;
  equipment?: Equipment[];
}

interface UseTimesheetAutoSelectionProps {
  workType: string;
  tascoLogs: TascoLog[];
  costCodes: CostCodeOption[] | AutoSelectionOptions[];
  materialTypes: AutoSelectionOptions[];
  jobsites: AutoSelectionOptions[];
  setJobsite: (jobsite: AutoSelectionOptions) => void;
  setCostCode: (costCode: AutoSelectionOptions | CostCodeOption) => void;
  setMaterial: (material: string, logIndex?: number) => void;
}

export const useTimesheetAutoSelection = ({
  workType,
  tascoLogs,
  costCodes,
  materialTypes,
  jobsites,
  setJobsite,
  setCostCode,
  setMaterial
}: UseTimesheetAutoSelectionProps) => {

  // Use refs to track previous values and prevent infinite loops
  const prevValuesRef = useRef({
    workType: '',
    shiftType: '',
    materialType: '',
    laborType: '',
    hasEquipment: false
  });

  // Memoize stable values to prevent unnecessary effect executions
  const currentShiftType = useMemo(() => 
    tascoLogs.length > 0 ? tascoLogs[0].shiftType : '', 
    [tascoLogs[0]?.shiftType]
  );

  const currentLaborType = useMemo(() => 
    tascoLogs.length > 0 ? tascoLogs[0].laborType : '', 
    [tascoLogs[0]?.laborType]
  );

  const currentMaterialType = useMemo(() => 
    tascoLogs.length > 0 ? tascoLogs[0].materialType : '', 
    [tascoLogs[0]?.materialType]
  );

  // Memoize equipment status with efficient comparison
  const hasAnyEquipment = useMemo(() => {
    return tascoLogs.some(log => {
      return log.equipment && 
        Array.isArray(log.equipment) && 
        log.equipment.length > 0 && 
        log.equipment.some((eq: Equipment) => eq.id && eq.id.trim() !== '');
    });
  }, [tascoLogs.map(log => 
    log.equipment?.map((eq: Equipment) => eq.id).join(',') || ''
  ).join('|')]);

  // Helper function to handle cost code format differences
  const findCostCode = (searchTerm: string) => {
    if (costCodes.length === 0) return null;
    
    // Check if it's the old format (value/label) or new format (id/name)
    const firstItem = costCodes[0];
    if ('value' in firstItem && 'label' in firstItem) {
      return (costCodes as CostCodeOption[]).find((cc) => 
        cc.label.includes('80.40') && cc.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (costCodes as AutoSelectionOptions[]).find((cc) => 
        cc.name.includes('80.40') && cc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const findLaborCostCode = () => {
    if (costCodes.length === 0) return null;
    
    const firstItem = costCodes[0];
    if ('value' in firstItem && 'label' in firstItem) {
      return (costCodes as CostCodeOption[]).find((cc) => 
        cc.label.toLowerCase().includes('amalgamated labor')
      );
    } else {
      return (costCodes as AutoSelectionOptions[]).find((cc) => 
        cc.name.toLowerCase().includes('amalgamated labor')
      );
    }
  };

  // Auto-selection for E-shift and F-shift
  useEffect(() => {
    if (workType !== 'tasco' || tascoLogs.length === 0) return;
    
    // Check if we've already processed this shift type
    if (prevValuesRef.current.workType === workType && 
        prevValuesRef.current.shiftType === currentShiftType) {
      return;
    }
    
    if (currentShiftType === 'E Shift') {
      // Set cost code to #80.40 Amalgamated Equipment
      const amalgamatedEquipmentCC = findCostCode('amalgamated equipment');
      if (amalgamatedEquipmentCC) {
        setCostCode(amalgamatedEquipmentCC);
      }

      // Set material to Mud Conditioning
      const mudConditioningMaterial = materialTypes.find(m => 
        m.name === 'Mud Conditioning'
      );
      if (mudConditioningMaterial) {
        setMaterial(mudConditioningMaterial.name, 0);
      }

      // Set jobsite to MH2526
      const mh2526Jobsite = jobsites.find(js => 
        js.name.includes('MH2526')
      );
      if (mh2526Jobsite) {
        setJobsite(mh2526Jobsite);
      }
    } else if (currentShiftType === 'F Shift') {
      // Set jobsite to MH2526
      const mh2526Jobsite = jobsites.find(js => 
        js.name.includes('MH2526')
      );
      if (mh2526Jobsite) {
        setJobsite(mh2526Jobsite);
      }

      // Set cost code to #80.40 Amalgamated Equipment
      const amalgamatedEquipmentCC = findCostCode('amalgamated equipment');
      if (amalgamatedEquipmentCC) {
        setCostCode(amalgamatedEquipmentCC);
      }

      // Set material to Lime Rock
      const limeRockMaterial = materialTypes.find(m => 
        m.name === 'Lime Rock'
      );
      if (limeRockMaterial) {
        setMaterial(limeRockMaterial.name, 0);
      }
    }
    
    // Update ref to track processed values
    prevValuesRef.current.workType = workType;
    prevValuesRef.current.shiftType = currentShiftType;
  }, [workType, currentShiftType, costCodes.length, materialTypes.length, jobsites.length]);

  // Auto-selection for Labor Type changes (ABCD shifts only)
  useEffect(() => {
    if (workType !== 'tasco' || tascoLogs.length === 0) return;
    
    const isABCDShift = currentShiftType === 'ABCD Shift';
    
    if (!isABCDShift || !currentLaborType) return;
    
    // Check if labor type has changed
    if (prevValuesRef.current.laborType === currentLaborType && 
        prevValuesRef.current.workType === workType) {
      return;
    }
    
    // Set cost code based on labor type
    if (currentLaborType === 'Labor' || currentLaborType === 'Manual Labor') {
      // Set to Amalgamated Labor
      const amalgamatedLaborCC = findLaborCostCode();
      if (amalgamatedLaborCC) {
        setCostCode(amalgamatedLaborCC);
      }
    } else if (currentLaborType === 'Equipment Operator' || currentLaborType === 'Operator') {
      // Set to Amalgamated Equipment
      const amalgamatedEquipmentCC = findCostCode('amalgamated equipment');
      if (amalgamatedEquipmentCC) {
        setCostCode(amalgamatedEquipmentCC);
      }
    }
    
    // Update ref
    prevValuesRef.current.laborType = currentLaborType;
    prevValuesRef.current.workType = workType;
  }, [
    workType, 
    currentShiftType,
    currentLaborType,
    costCodes.length
  ]);

  // Auto-selection for equipment-based cost code (applies to all TASCO logs)
  useEffect(() => {
    if (workType !== 'tasco' || tascoLogs.length === 0) return;
    
    // Check if equipment status has changed
    if (prevValuesRef.current.hasEquipment === hasAnyEquipment && 
        prevValuesRef.current.workType === workType) {
      return;
    }
    
    // For non-ABCD shifts, always set based on equipment
    const isABCDShift = currentShiftType === 'ABCD Shift';
    
    if (!isABCDShift) {
      if (hasAnyEquipment) {
        // Set to Amalgamated Equipment when any equipment is selected
        const amalgamatedEquipmentCC = findCostCode('amalgamated equipment');
        if (amalgamatedEquipmentCC) {
          setCostCode(amalgamatedEquipmentCC);
        }
      }
    } else {
      // For ABCD shifts, only set if no labor type is selected yet
      if (hasAnyEquipment && !currentLaborType) {
        const amalgamatedEquipmentCC = findCostCode('amalgamated equipment');
        if (amalgamatedEquipmentCC) {
          setCostCode(amalgamatedEquipmentCC);
        }
      } else if (!hasAnyEquipment && !currentLaborType) {
        // Set to Amalgamated Labor when no equipment and no labor type
        const amalgamatedLaborCC = findLaborCostCode();
        if (amalgamatedLaborCC) {
          setCostCode(amalgamatedLaborCC);
        }
      }
    }
    
    // Update ref
    prevValuesRef.current.hasEquipment = hasAnyEquipment;
    prevValuesRef.current.workType = workType;
  }, [
    workType, 
    hasAnyEquipment,
    costCodes.length
  ]);

  // Auto-selection for ABCD shifts - Material-based jobsite
  useEffect(() => {
    if (workType !== 'tasco' || tascoLogs.length === 0) return;
    
    const isABCDShift = ['ABCD Shift'].includes(currentShiftType || '');
    
    if (!isABCDShift || !currentMaterialType) return;
    
    // Check if material has changed
    if (prevValuesRef.current.materialType === currentMaterialType) {
      return;
    }
    
    const material = currentMaterialType;
    
    // Materials for MH2526
    const mh2526Materials = [
      'Rock', 'Elmico', 'Coal', 'Lime Kiln', 'Ag waste', 
      'Belt Mud', 'End of campaign', 'Mud Conditioning', 'Lime Rock'
    ];
    
    // Materials for DC2526
    const dc2526Materials = ['Dust Control'];
    
    // Materials for PCC2526
    const pcc2526Materials = ['Push PCC', 'Rip west', 'Rip center', 'Rip east'];
    
    let targetJobsitePattern = '';
    
    if (mh2526Materials.includes(material)) {
      targetJobsitePattern = 'MH2526';
    } else if (dc2526Materials.includes(material)) {
      targetJobsitePattern = 'DC2526';
    } else if (pcc2526Materials.includes(material)) {
      targetJobsitePattern = 'PCC2526';
    }
    
    if (targetJobsitePattern) {
      const targetJobsite = jobsites.find(js => 
        js.name.includes(targetJobsitePattern)
      );
      if (targetJobsite) {
        setJobsite(targetJobsite);
      }
    }
    
    // Update ref
    prevValuesRef.current.materialType = currentMaterialType;
  }, [
    workType, 
    currentShiftType,
    currentMaterialType,
    jobsites.length
  ]);
};